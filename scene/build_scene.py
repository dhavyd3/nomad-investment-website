"""
Builds the Nomad services diorama and exports it for the web.

Run headless:
  blender --background --factory-startup --python scene/build_scene.py

Outputs, all into site/public/scene:
  nomad-scene.glb     the model, Draco-compressed
  camera-stops.json   camera keyframes, read by the three.js rig
  preview-*.png       one still per stop, so the framing can be checked

The camera stops live here rather than in the TypeScript because the framing only
means anything relative to the geometry, and the geometry is defined here. The rig
imports the JSON so there is one set of numbers, not two that drift apart.

Everything animated at runtime is named `anim_*` — the rig looks nodes up by that
name, so moving a part in this file does not require touching the rig.
"""

import bpy
import json
import math
import os
import sys

from mathutils import Matrix, Vector

# --------------------------------------------------------------------------
# paths
# --------------------------------------------------------------------------
HERE = os.path.dirname(os.path.abspath(__file__))
# the model is fetched at runtime, so it lives in public
OUT = os.path.normpath(os.path.join(HERE, "..", "public", "scene"))
# preview stills are a check on framing, not a shipped asset — keep them out of
# public/ so they are neither deployed nor served
OUT_PREVIEW = os.path.join(HERE, "previews")
# the stops are imported by the rig, so they live in src and get type-checked
OUT_SRC = os.path.normpath(os.path.join(HERE, "..", "src", "scene"))
os.makedirs(OUT, exist_ok=True)
os.makedirs(OUT_PREVIEW, exist_ok=True)
os.makedirs(OUT_SRC, exist_ok=True)

PREVIEW = "--preview" in sys.argv
FAST = "--fast" in sys.argv

# --------------------------------------------------------------------------
# palette — sampled from the site's own tokens in globals.css
# --------------------------------------------------------------------------
def srgb(hex_str, a=1.0):
    """Blender wants linear; the tokens are sRGB."""
    h = hex_str.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, a)


GOLD = "#ffde59"
NAVY = "#060644"

# --------------------------------------------------------------------------
# zone layout, in metres. A loose horseshoe so the camera arcs between stops
# rather than sliding along a line.
# --------------------------------------------------------------------------
ZONES = {
    "business":    (-250.0,  110.0),
    "ict":         ( -55.0,  180.0),
    "engineering": ( 150.0,  120.0),
    "agriculture": ( 200.0, -110.0),
    "energy":      (-130.0, -140.0),
}

# --------------------------------------------------------------------------
# scene setup
# --------------------------------------------------------------------------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"

_materials = {}
_meshes = {}

# Every object built inside a zone is recorded, so the camera can be framed from
# what is actually there rather than from a radius guessed by hand.
_zone_objects = {}
_current_zone = None

# Everything in this file is authored in world coordinates, but parts are also
# parented so the GLB carries a usable hierarchy (and so `anim_*` pivots rotate
# about themselves). Parenting alone would apply the parent's offset a second time,
# so each child gets a parent-inverse that cancels it. Blender's UI does this for
# you on "keep transform"; building objects through the API it has to be explicit.
_world_loc = {}


def _attach(ob, parent, location):
    _world_loc[ob] = Vector(location)
    if parent is not None:
        ob.parent = parent
        ob.matrix_parent_inverse = Matrix.Translation(-_world_loc[parent])


def mat(name, hex_color, rough=0.65, metal=0.0, emit=None, emit_strength=1.0):
    if name in _materials:
        return _materials[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(hex_color)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = srgb(emit)
        b.inputs["Emission Strength"].default_value = emit_strength
    _materials[name] = m
    return m


# The board is a white technical illustration, the way the reference draws its
# campus: near-white ground and context massing, with each zone's subject picked out
# in Nomad's navy and gold. Figure/ground does the work that darkness used to.
MATS = {
    "ground":    lambda: mat("ground",    "#efefec", rough=0.95),
    "plaza":     lambda: mat("plaza",     "#e4e4e0", rough=0.9),
    "road":      lambda: mat("road",      "#dcdcd8", rough=0.85),
    "chalk":     lambda: mat("chalk",     "#f7f7f5", rough=0.85),   # context massing
    "ink":       lambda: mat("ink",       "#242430", rough=0.7),    # the dark hero forms
    "navy":      lambda: mat("navy",      NAVY,      rough=0.55),
    "navy_lit":  lambda: mat("navy_lit",  "#1b1b6b", rough=0.45),
    "steel":     lambda: mat("steel",     "#9a9ab0", rough=0.45, metal=0.4),
    "steel_lit": lambda: mat("steel_lit", "#c2c2d2", rough=0.4, metal=0.4),
    "gold":      lambda: mat("gold",      GOLD,      rough=0.35, metal=0.35),
    "gold_glow": lambda: mat("gold_glow", GOLD,      rough=0.4, emit=GOLD, emit_strength=1.4),
    "window":    lambda: mat("window",    "#c9a83c", rough=0.35, emit=GOLD, emit_strength=0.3),
    # the warehouse interior is only ever seen with the roof off, and the walls put
    # it in shade — it carries a little of its own light rather than relying on the sun
    "interior":  lambda: mat("interior",  "#d8d8e2", rough=0.85, emit="#ffffff", emit_strength=0.12),
    "strip":     lambda: mat("strip",     "#c9a83c", rough=0.4, emit=GOLD, emit_strength=0.9),
    "crop":      lambda: mat("crop",      "#5f9e58", rough=0.9),
    "crop_lit":  lambda: mat("crop_lit",  "#7cbb72", rough=0.9),
    "soil":      lambda: mat("soil",      "#cfc0ac", rough=0.95),
    "rust":      lambda: mat("rust",      "#b8794a", rough=0.8),
    "roof":      lambda: mat("roof",      "#8a5a3a", rough=0.75),
    "pale":      lambda: mat("pale",      "#ffffff", rough=0.7),
    "glass":     lambda: mat("glass",     "#aab0d8", rough=0.15, metal=0.2),
}


def unit_mesh(kind, material_key):
    """One mesh datablock per (shape, material). Objects link to it, so a hundred
    towers cost one mesh — which keeps both Blender and the exported GLB small."""
    key = f"{kind}:{material_key}"
    if key in _meshes:
        return _meshes[key]

    if kind == "cube":
        bpy.ops.mesh.primitive_cube_add(size=1)
    elif kind == "cyl":
        bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=1, vertices=16)
    elif kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, segments=12, ring_count=8)
    elif kind == "cone":
        bpy.ops.mesh.primitive_cone_add(radius1=0.5, depth=1, vertices=12)
    else:
        raise ValueError(kind)

    ob = bpy.context.object
    me = ob.data
    me.name = key
    me.materials.append(MATS[material_key]())
    bpy.data.objects.remove(ob, do_unlink=True)
    _meshes[key] = me
    return me


def add(kind, material_key, name, loc, scale=(1, 1, 1), rot=(0, 0, 0), parent=None,
        frameable=True):
    """`frameable=False` keeps a thing out of the camera fit. Ground pads are much
    wider than what stands on them, so fitting them shrinks the actual subject to a
    smudge in the middle of an empty plate."""
    ob = bpy.data.objects.new(name, unit_mesh(kind, material_key))
    ob.location = loc
    ob.scale = scale
    ob.rotation_euler = rot
    scene.collection.objects.link(ob)
    _attach(ob, parent, loc)
    if _current_zone and frameable:
        _zone_objects.setdefault(_current_zone, []).append(ob)
    return ob


def empty(name, loc, parent=None):
    """Pivot for anything the runtime animates. Exported as a plain node."""
    ob = bpy.data.objects.new(name, None)
    ob.empty_display_size = 2
    ob.location = loc
    scene.collection.objects.link(ob)
    _attach(ob, parent, loc)
    return ob


def box(material_key, name, cx, cy, w, d, h, z=0.0, parent=None, rot=(0, 0, 0),
        frameable=True):
    """Footprint-and-height box, sitting on z. Reads closer to how buildings are
    actually described than centre-and-scale does."""
    return add("cube", material_key, name, (cx, cy, z + h / 2), (w, d, h), rot, parent,
               frameable=frameable)


# ==========================================================================
# ground
# ==========================================================================
# Wide enough that its edge never enters a shot — a visible horizon line reads as a
# tabletop model rather than a place. The establishing shot sits ~1100m out, so this
# has to be a good deal larger than it intuitively needs to be.
add("cube", "ground", "ground", (0, 0, -1.0), (5000, 5000, 2), frameable=False)


def apron(name, cx, cy, w, d, material_key="plaza"):
    """A slightly raised pad under each zone, so zones read as places on one
    continuous plane rather than objects floating on a void."""
    return add("cube", material_key, name, (cx, cy, 0.15), (w, d, 0.3), frameable=False)


# ==========================================================================
# 01 — business consulting & investor relations: an economic city
# ==========================================================================
def build_city():
    cx, cy = ZONES["business"]
    root = empty("zone.business", (cx, cy, 0))
    apron("apron.business", cx, cy, 118, 104)

    towers = [
        (-38, -30, 15, 15, 46), (-16, -34, 13, 13, 30), (6, -28, 16, 16, 62),
        (28, -32, 14, 14, 38), (-40, -6, 14, 14, 34), (-18, -8, 17, 17, 70),
        (8, -4, 14, 14, 52), (30, -8, 15, 15, 44), (-34, 20, 13, 13, 26),
        (-12, 22, 16, 16, 58), (12, 20, 14, 14, 36), (34, 22, 15, 15, 48),
        (-28, 40, 14, 14, 22), (16, 42, 15, 15, 32),
    ]
    for i, (x, y, w, d, h) in enumerate(towers):
        # mostly white massing with a few picked out — the reference's figure/ground
        key = "gold" if i in (5, 9) else ("navy" if i % 3 == 0 else "chalk")
        box(key, f"tower.{i:02d}", cx + x, cy + y, w, d, h, parent=root)
        # Lit floor bands. Without them the towers read as plain slabs at every
        # camera distance; banding gives the skyline scale and a rhythm.
        for band in range(1, int(h // 11)):
            box("window", f"tower.win.{i:02d}.{band}", cx + x, cy + y,
                w * 1.005, d * 1.005, 0.5, z=band * 11, parent=root, frameable=False)
        # a lit crown, so the taller massing still reads from above
        if h > 34:
            box("gold_glow", f"tower.crown.{i:02d}", cx + x, cy + y,
                w * 0.92, d * 0.92, 1.2, z=h - 3.5, parent=root)

    # boulevard + a few vehicles, small the way the reference draws its cars
    add("cube", "steel", "boulevard", (cx, cy + 4, 0.32), (116, 9, 0.2), parent=root)
    for i, x in enumerate((-44, -18, 10, 36)):
        box("gold", f"car.{i}", cx + x, cy + 2.2, 3.4, 1.7, 1.2, z=0.4, parent=root)
        box("pale", f"car.b.{i}", cx + x + 14, cy + 6.0, 3.0, 1.6, 1.1, z=0.4, parent=root)
    return root


# ==========================================================================
# 02 — ICT, AI & cybersecurity: warehouse whose roof lifts away
# ==========================================================================
def build_warehouse():
    cx, cy = ZONES["ict"]
    root = empty("zone.ict", (cx, cy, 0))
    apron("apron.ict", cx, cy, 104, 88)

    W, D, H = 62.0, 42.0, 13.0

    # floor slab
    add("cube", "interior", "wh.floor", (cx, cy, 0.4), (W, D, 0.5), parent=root)

    # --- interior, revealed when the roof goes ---
    inner = empty("wh.interior", (cx, cy, 0), parent=root)

    # light strips down the aisles, so the reveal is legible once the roof is off
    for i in range(4):
        add("cube", "strip", f"wh.strip.{i}", (cx, cy - D / 2 + 8 + i * 8.5, 0.68),
            (W - 8, 0.8, 0.12), parent=inner, frameable=False)

    for r in range(3):
        for c in range(5):
            dx = cx - W / 2 + 9 + c * 11
            dy = cy - D / 2 + 10 + r * 11
            box("steel_lit", f"wh.desk.{r}{c}", dx, dy, 6.4, 3.2, 1.5, z=0.65, parent=inner)
            box("gold_glow", f"wh.screen.{r}{c}", dx, dy + 0.9, 3.0, 0.25, 1.9,
                z=2.15, parent=inner)
            # a person at the desk
            add("cyl", "pale", f"wh.person.{r}{c}",
                (dx, dy - 2.6, 1.45), (1.7, 1.7, 2.5), parent=inner)
            add("sphere", "pale", f"wh.head.{r}{c}",
                (dx, dy - 2.6, 3.1), (1.7, 1.7, 1.7), parent=inner)

    # server racks along the back wall, with lit fronts
    for i in range(6):
        rx = cx - W / 2 + 8 + i * 7
        box("steel_lit", f"wh.rack.{i}", rx, cy + D / 2 - 5, 4.0, 2.6, 7.5, z=0.65,
            parent=inner)
        box("strip", f"wh.rack.led.{i}", rx, cy + D / 2 - 6.4, 2.6, 0.3, 5.0, z=1.6,
            parent=inner, frameable=False)

    # --- shell: walls stay, roof lifts ---
    t = 0.6
    box("ink", "wh.wall.n", cx, cy + D / 2, W, t, H, parent=root)
    box("ink", "wh.wall.s", cx, cy - D / 2, W, t, H, parent=root)
    box("navy", "wh.wall.e", cx + W / 2, cy, t, D, H, parent=root)
    box("navy", "wh.wall.w", cx - W / 2, cy, t, D, H, parent=root)

    # the roof hangs off its own pivot so the rig can raise and fade it
    roof = empty("anim_roof_ict", (cx, cy, H), parent=root)
    add("cube", "ink", "wh.roof.slab", (cx, cy, H + 0.5), (W + 1.5, D + 1.5, 1.0),
        parent=roof)
    for i in range(4):
        add("cube", "gold_glow", f"wh.roof.light.{i}",
            (cx - 21 + i * 14, cy, H + 1.15), (10, 1.2, 0.25), parent=roof)

    # --- the yard, so it reads as a working facility rather than a lone shed ---
    yard_y = cy - D / 2 - 15
    add("cube", "road", "wh.yard", (cx, yard_y, 0.14), (W + 24, 26, 0.28),
        parent=root, frameable=False)
    # loading docks along the near wall
    for i in range(4):
        dx = cx - 24 + i * 16
        box("steel", f"wh.dock.{i}", dx, cy - D / 2 - 2.4, 9, 4, 2.4, parent=root)
        box("gold_glow", f"wh.dock.light.{i}", dx, cy - D / 2 - 0.4, 6, 0.4, 0.4,
            z=4.2, parent=root, frameable=False)
    # parked trailers
    for i, off in enumerate((-30, -8, 16)):
        box("pale", f"wh.trailer.{i}", cx + off, yard_y - 2, 16, 5, 4.2, z=0.9,
            parent=root)
        box("steel_lit", f"wh.cab.{i}", cx + off + 11, yard_y - 2, 5, 5, 4.6, z=0.9,
            parent=root)
    # a mast light over the yard
    for i, off in enumerate((-38, 30)):
        add("cyl", "steel", f"wh.mast.{i}", (cx + off, yard_y - 12, 9), (1.4, 1.4, 18),
            parent=root)
        add("cube", "gold_glow", f"wh.mast.lamp.{i}", (cx + off, yard_y - 12, 18.4),
            (4, 2, 0.8), parent=root, frameable=False)
    return root


# ==========================================================================
# 03 — engineering & infrastructure: an active construction site
# ==========================================================================
def build_construction():
    cx, cy = ZONES["engineering"]
    root = empty("zone.engineering", (cx, cy, 0))
    apron("apron.engineering", cx, cy, 132, 112, material_key="soil")

    # --- the frame -------------------------------------------------------
    # A regular column grid with slabs sized to the columns they actually sit on.
    # The first pass centred each slab on the *first* column rather than on the
    # grid, which is what made the tower read as scattered posts rather than a
    # building going up.
    COLS, ROWS, LEVELS = 5, 4, 4
    SX, SY, FLOOR = 13.0, 12.0, 9.0
    gw, gd = (COLS - 1) * SX, (ROWS - 1) * SY
    ox, oy = cx - gw / 2 - 8, cy - gd / 2 + 14

    for lvl in range(LEVELS):
        z = lvl * FLOOR
        # the top floor is still going up, so it is short of its full width
        built = COLS if lvl < LEVELS - 1 else 3
        for i in range(built):
            for j in range(ROWS):
                box("steel_lit", f"cn.col.{lvl}.{i}.{j}", ox + i * SX, oy + j * SY,
                    1.4, 1.4, FLOOR, z=z, parent=root)
        span = (built - 1) * SX
        box("steel", f"cn.slab.{lvl}", ox + span / 2, oy + gd / 2,
            span + 5, gd + 5, 0.8, z=z + FLOOR - 0.8, parent=root)

    # clad the lower floors on one side: the building is finished from the bottom up
    for lvl in range(2):
        box("navy_lit", f"cn.facade.{lvl}", ox + gw / 2, oy - 2.5,
            gw + 5, 0.7, FLOOR - 1.6, z=lvl * FLOOR + 0.6, parent=root)
        for k in range(4):
            box("window", f"cn.facade.win.{lvl}.{k}", ox + 4 + k * 13, oy - 2.9,
                8, 0.4, 2.2, z=lvl * FLOOR + 3.4, parent=root, frameable=False)

    # --- tower crane, standing against the building rather than off on its own ---
    mx, my = ox + gw + 13, oy + gd / 2
    box("gold", "cn.mast", mx, my, 2.6, 2.6, 54, parent=root)
    jib = empty("anim_crane_jib", (mx, my, 54), parent=root)
    add("cube", "gold", "cn.jib", (mx - 20, my, 55.4), (48, 1.6, 1.4), parent=jib)
    add("cube", "gold", "cn.jib.tail", (mx + 11, my, 55.4), (14, 1.6, 1.4), parent=jib)
    add("cube", "steel", "cn.jib.counter", (mx + 16, my, 54.0), (5, 3, 3), parent=jib)
    add("cube", "pale", "cn.hoist", (mx - 30, my, 47.0), (0.3, 0.3, 15), parent=jib)
    add("cube", "rust", "cn.load", (mx - 30, my, 38.5), (4.5, 4.5, 2.6), parent=jib)

    # --- the yard --------------------------------------------------------
    box("gold", "cn.dig.body", cx - 46, cy - 34, 8.0, 5.0, 3.4, z=0.9, parent=root)
    arm = empty("anim_dig_arm", (cx - 42, cy - 34, 4.2), parent=root)
    add("cube", "gold", "cn.dig.arm", (cx - 36, cy - 34, 6.4), (11, 1.2, 1.2),
        rot=(0, math.radians(-22), 0), parent=arm)

    box("steel_lit", "cn.truck.cab", cx - 2, cy - 42, 4.4, 4.0, 3.6, z=0.9, parent=root)
    box("steel", "cn.truck.bed", cx + 5, cy - 42, 9.0, 4.4, 2.8, z=1.4, parent=root)

    for i, (hx, hy, s) in enumerate(((36, -34, 5.0), (45, -23, 3.6), (28, -21, 2.8))):
        add("cone", "soil", f"cn.spoil.{i}", (cx + hx, cy + hy, s / 2),
            (s * 2.4, s * 2.4, s), parent=root)

    # stacked material and a site hut, so the yard reads as in use
    for i in range(3):
        box("rust", f"cn.stack.{i}", cx - 44 + i * 9, cy - 12, 7, 4, 1.6,
            z=i * 0.1, parent=root)
    box("pale", "cn.hut", cx - 48, cy + 16, 9, 6, 3.4, parent=root)

    # crew, small and gold so they read against the soil
    for i, (px, py) in enumerate(((-24, -28), (2, -20), (-34, 4), (26, -6), (-10, 26))):
        add("cyl", "gold", f"cn.crew.{i}", (cx + px, cy + py, 1.3), (1.5, 1.5, 2.6),
            parent=root)
        add("sphere", "pale", f"cn.crew.h.{i}", (cx + px, cy + py, 2.95), (1.5, 1.5, 1.5),
            parent=root)
    return root


# ==========================================================================
# 04 — agricultural services: plantation, barn, livestock
# ==========================================================================
def build_farm():
    cx, cy = ZONES["agriculture"]
    root = empty("zone.agriculture", (cx, cy, 0))
    apron("apron.agriculture", cx, cy, 130, 112, material_key="soil")

    # plantation, in blocks rather than one field of identical stripes
    for r in range(12):
        key = "crop" if r % 2 else "crop_lit"
        # a couple of rows are between crops, which stops the field reading as a
        # printed pattern
        if r in (4, 9):
            key = "soil"
        h = 0.7 if key == "soil" else 1.1 + (r % 3) * 0.25
        add("cube", key, f"fm.row.{r}", (cx - 24, cy - 46 + r * 7.2, h / 2 + 0.3),
            (64, 5.2, h), parent=root)

    # --- barn: two roof planes meeting at a ridge --------------------------
    bx, by, bw, bd, bh, rise = cx + 38, cy + 30, 24.0, 18.0, 9.0, 6.0
    box("rust", "fm.barn", bx, by, bw, bd, bh, parent=root)
    slant = math.hypot(bd / 2, rise)
    pitch = math.atan2(rise, bd / 2)
    for s in (-1, 1):
        # the +y plane has to fall as y grows, which is a negative rotation about X
        add("cube", "roof", f"fm.barn.roof.{'p' if s > 0 else 'n'}",
            (bx, by + s * bd / 4, bh + rise / 2), (bw + 3, slant, 0.8),
            rot=(-s * pitch, 0, 0), parent=root)
    # No gable boxes here: a rectangle tall enough to fill the ridge also pokes out
    # above the eaves, which is worse than the small triangle it would have closed.
    box("soil", "fm.barn.door", bx - bw / 2 - 0.3, by, 0.6, 6, 6, parent=root)

    # silo, stood clear of the barn so it does not mask it from the camera
    sx, sy = cx + 20, cy + 34
    add("cyl", "pale", "fm.silo", (sx, sy, 9), (9, 9, 18), parent=root)
    add("sphere", "pale", "fm.silo.cap", (sx, sy, 18.4), (9, 9, 6), parent=root)
    for i in range(3):
        add("cyl", "steel", f"fm.silo.band.{i}", (sx, sy, 4 + i * 5),
            (9.3, 9.3, 0.5), parent=root)

    # --- livestock: bodies with legs. Spheres at this scale read as golf balls ---
    herd = empty("anim_herd", (cx, cy, 0), parent=root)
    for i, (px, py) in enumerate(((10, -22), (24, -30), (36, -16), (18, -38), (42, -34),
                                  (4, -32), (30, -44))):
        gx, gy = cx + px, cy + py
        box("pale", f"fm.cow.{i}", gx, gy, 5.0, 2.2, 2.2, z=1.6, parent=herd)
        box("pale", f"fm.cow.head.{i}", gx + 3.1, gy, 1.8, 1.6, 1.6, z=2.0, parent=herd)
        for k, (lx, ly) in enumerate(((-1.7, -0.8), (-1.7, 0.8), (1.7, -0.8), (1.7, 0.8))):
            box("pale", f"fm.cow.leg.{i}.{k}", gx + lx, gy + ly, 0.5, 0.5, 1.6,
                parent=herd, frameable=False)

    # fencing — what actually makes the empty ground read as a pasture
    for i in range(11):
        box("rust", f"fm.fence.s.{i}", cx - 4 + i * 6, cy - 52, 0.5, 0.5, 2.0,
            parent=root, frameable=False)
    for i in range(9):
        box("rust", f"fm.fence.e.{i}", cx + 56, cy - 52 + i * 6, 0.5, 0.5, 2.0,
            parent=root, frameable=False)

    # tractor, out working the rows where the camera can actually see it
    tractor = empty("anim_tractor", (cx - 30, cy - 10, 0), parent=root)
    add("cube", "gold", "fm.tractor", (cx - 30, cy - 10, 2.2), (7.0, 3.4, 2.8),
        parent=tractor)
    add("cube", "gold", "fm.tractor.cab", (cx - 31.5, cy - 10, 4.4), (3.2, 3.0, 2.2),
        parent=tractor)
    for k, (wx, wr) in enumerate(((-2.4, 2.6), (2.2, 1.7))):
        add("cyl", "steel", f"fm.tractor.w.{k}", (cx - 30 + wx, cy - 10, wr / 2 + 0.4),
            (wr, 3.8, wr), rot=(math.radians(90), 0, 0), parent=tractor)
    return root


# ==========================================================================
# 05 — oil, gas & green energy: tanks, pump jack, turbines
# ==========================================================================
def build_energy():
    cx, cy = ZONES["energy"]
    root = empty("zone.energy", (cx, cy, 0))
    apron("apron.energy", cx, cy, 118, 100)

    # storage tanks
    for i, (px, py, r) in enumerate(((-34, 22, 11), (-8, 30, 9), (-30, -4, 8))):
        add("cyl", "navy", f"en.tank.{i}", (cx + px, cy + py, 7), (r * 2, r * 2, 14),
            parent=root)
        add("cyl", "gold", f"en.tank.band.{i}", (cx + px, cy + py, 13.6),
            (r * 2.08, r * 2.08, 0.7), parent=root)

    # --- pump jack -------------------------------------------------------
    # Built to the real anatomy rather than a bar on a post: skid, Samson post,
    # walking beam on a saddle bearing, horse head over the wellhead, pitman arms
    # down to a counterweighted crank. It is the one machine on the board everyone
    # recognises, so it has to be right or the whole zone reads as abstract.
    px_, py_ = cx + 16, cy + 14
    POST_H, BEAM_L = 13.0, 26.0

    box("ink", "en.pump.skid", px_, py_, 26, 8, 1.2, parent=root)

    # Samson post: two legs leaning in to the saddle bearing
    for s in (-1, 1):
        lean = math.radians(9)
        add("cube", "steel_lit", f"en.pump.post.{'p' if s > 0 else 'n'}",
            (px_ + s * 2.4, py_, 1.2 + POST_H / 2), (1.3, 1.3, POST_H),
            rot=(0, -s * lean, 0), parent=root)
    box("steel", "en.pump.saddle", px_, py_, 4.0, 3.0, 1.0, z=1.2 + POST_H, parent=root)

    # walking beam — everything that rocks hangs off this pivot
    beam = empty("anim_pump_beam", (px_, py_, 1.2 + POST_H + 0.5), parent=root)
    bz = 1.2 + POST_H + 0.5
    add("cube", "gold", "en.pump.beam", (px_, py_, bz + 0.9), (BEAM_L, 1.5, 1.8),
        parent=beam)

    # horse head: a stack that steps forward and down, so it reads curved in profile
    hx = px_ - BEAM_L / 2
    for k, (ox, oz, w, h) in enumerate(((0.0, -1.4, 3.2, 4.0), (-1.4, -3.6, 2.6, 3.2),
                                        (-2.4, -6.2, 2.0, 2.6))):
        add("cube", "gold", f"en.pump.head.{k}", (hx + ox, py_, bz + oz),
            (w, 2.0, h), parent=beam)
    # bridle cable down to the polished rod
    add("cube", "ink", "en.pump.bridle", (hx - 3.0, py_, bz - 9.5), (0.4, 0.4, 6.0),
        parent=beam)

    # pitman arms from the rear of the beam down to the crank
    for s in (-1, 1):
        add("cube", "steel_lit", f"en.pump.pitman.{'p' if s > 0 else 'n'}",
            (px_ + BEAM_L / 2 - 2.0, py_ + s * 2.2, bz - 5.4), (0.9, 0.9, 11.0),
            rot=(0, math.radians(11), 0), parent=root)

    # crank disc with counterweights, on its own pivot so the rig can turn it
    crank = empty("anim_pump_crank", (px_ + BEAM_L / 2 - 3.4, py_, 4.6), parent=root)
    for s in (-1, 1):
        add("cyl", "steel", f"en.pump.crank.{'p' if s > 0 else 'n'}",
            (px_ + BEAM_L / 2 - 3.4, py_ + s * 2.6, 4.6), (7.0, 1.2, 7.0),
            rot=(math.radians(90), 0, 0), parent=crank)
        add("cube", "ink", f"en.pump.weight.{'p' if s > 0 else 'n'}",
            (px_ + BEAM_L / 2 - 3.4, py_ + s * 2.6, 7.2), (3.0, 1.6, 3.2), parent=crank)

    # gearbox and prime mover on the skid
    box("steel", "en.pump.gearbox", px_ + BEAM_L / 2 - 3.4, py_, 6.0, 6.0, 3.4, z=1.2,
        parent=root)
    box("gold", "en.pump.motor", px_ + BEAM_L / 2 + 2.4, py_, 4.0, 3.2, 2.6, z=1.2,
        parent=root)

    # wellhead the horse head works over
    box("ink", "en.pump.wellhead", hx - 3.0, py_, 2.2, 2.2, 3.0, z=1.2, parent=root)

    # wind turbines: tower fixed, hub spins
    for i, (px, py, s) in enumerate(((26, -26, 1.0), (46, -6, 0.86), (10, -44, 0.92))):
        h = 34 * s
        add("cyl", "ink", f"en.tower.{i}", (cx + px, cy + py, h / 2), (2.2, 2.2, h),
            parent=root)
        hub = empty(f"anim_turbine_hub_{i:02d}", (cx + px, cy + py, h), parent=root)
        add("cyl", "gold", f"en.hub.{i}", (cx + px, cy + py, h), (2.4, 2.4, 1.8),
            rot=(math.radians(90), 0, 0), parent=hub)
        # Blades radiate in the hub's YZ plane, so the rig spins the hub about X.
        # Each is a thin slab pushed half its length along its own rotated up-axis.
        blade_len = 17 * s
        for b in range(3):
            a = math.radians(b * 120)
            add("cube", "ink", f"en.blade.{i}{b}",
                (cx + px,
                 cy + py - math.sin(a) * blade_len / 2,
                 h + math.cos(a) * blade_len / 2),
                (0.5, 1.7, blade_len),
                rot=(a, 0, 0), parent=hub)

    # a flare stack, for silhouette
    add("cyl", "ink", "en.flare", (cx - 46, cy - 30, 13), (2.4, 2.4, 26), parent=root)
    add("cone", "gold_glow", "en.flare.tip", (cx - 46, cy - 30, 27.5), (3.4, 3.4, 4),
        parent=root)
    return root


def road(name, a, b, width=16.0):
    """A link between two zones. Without these the zones read as five islands on a
    void — the same criticism the flat board earned. Roads make it one operation
    the camera is moving across."""
    (ax, ay), (bx, by) = a, b
    dx, dy = bx - ax, by - ay
    add("cube", "road", name, ((ax + bx) / 2, (ay + by) / 2, 0.12),
        (math.hypot(dx, dy), width, 0.25), rot=(0, 0, math.atan2(dy, dx)),
        frameable=False)


ROUTE = ["business", "ict", "engineering", "agriculture", "energy", "business"]
for _i in range(len(ROUTE) - 1):
    road(f"road.{_i}", ZONES[ROUTE[_i]], ZONES[ROUTE[_i + 1]])

for _key, _fn in (
    ("business", build_city),
    ("ict", build_warehouse),
    ("engineering", build_construction),
    ("agriculture", build_farm),
    ("energy", build_energy),
):
    _current_zone = _key
    _fn()
_current_zone = None

# ==========================================================================
# lighting — one warm key raking across, a cool fill, and a rim
# ==========================================================================
def sun(name, strength, elevation_deg, azimuth_deg, color=(1, 1, 1), angle_deg=2.5):
    """Suns rather than area lights: at a 300m scene scale their strength is plain
    irradiance, so it is predictable, and the parallel rays give the crisp long
    shadows that carry the depth."""
    d = bpy.data.lights.new(name, type="SUN")
    d.energy = strength
    d.color = color
    d.angle = math.radians(angle_deg)  # softens the shadow edge
    ob = bpy.data.objects.new(name, d)
    # elevation measured up from the horizon, azimuth clockwise from +X
    ob.rotation_euler = (
        math.radians(90 - elevation_deg),
        0.0,
        math.radians(azimuth_deg + 90),
    )
    scene.collection.objects.link(ob)
    return ob


# A white board needs a flatter, brighter rig than a dark one: a soft key for legible
# form, a wide fill so the shadow sides do not go muddy, and a large sun angle so the
# shadows are soft grey drawings rather than hard black cuts.
sun("key", 2.6, 42, -55, color=(1.0, 0.97, 0.92), angle_deg=5.0)
sun("fill", 1.1, 28, 145, color=(0.90, 0.93, 1.0), angle_deg=20.0)
sun("rim", 0.5, 16, 80, color=(1.0, 0.95, 0.82), angle_deg=10.0)

world = bpy.data.worlds.new("world")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = srgb("#f4f4f2")
world.node_tree.nodes["Background"].inputs[1].default_value = 0.85
scene.world = world

# ==========================================================================
# camera stops
# ==========================================================================
# ==========================================================================
# the hero plate's subject: Nomad's own offices
# ==========================================================================
def build_hq(cx, cy):
    """A headquarters building for the hero image — a podium, a tower and a
    forecourt. Built well away from the board and deleted again after rendering,
    so it never reaches the GLB: it is a still-life for one picture, not part of
    the operation the camera flies over.

    Returns (everything it made, the parts worth framing). The forecourt is much
    wider than the building, so fitting the camera to it would shrink the tower to a
    detail in the middle of an empty slab — the same trap the zone pads set.
    """
    made = []
    subject = []

    def keep(ob, frameable=True):
        made.append(ob)
        if frameable:
            subject.append(ob)
        return ob

    def hbox(material_key, name, x, y, w, d, h, z=0.0, frameable=True):
        return keep(box(material_key, name, cx + x, cy + y, w, d, h, z=z), frameable)

    # Forecourt, in navy rather than paper. The plate is composited onto the dark
    # hero, and a light ground reads as a white card pasted behind the building —
    # the exact "it has its own background" problem. Dark, it grounds the model
    # without ever announcing an edge.
    keep(add("cube", "navy", "hq.plinth", (cx, cy, 0.4), (128, 96, 0.8)), False)
    keep(add("cube", "navy", "hq.apron", (cx - 6, cy - 34, 0.9), (86, 22, 1.0)), False)

    # podium
    PW, PD, PH = 78.0, 46.0, 13.0
    hbox("navy_lit", "hq.podium", 0, 0, PW, PD, PH, z=0.8)
    # a glazed ground floor reads as an entrance level rather than a plinth
    for i in range(9):
        hbox("gold_glow", f"hq.podium.glaze.{i}", -PW / 2 + 6 + i * 8.6, -PD / 2 - 0.2,
             6.4, 0.6, 5.2, z=2.0)
    # parapet band
    hbox("chalk", "hq.podium.cap", 0, 0, PW + 2.0, PD + 2.0, 1.4, z=0.8 + PH)

    # tower, set back on the podium
    TW, TD, TH = 32.0, 27.0, 82.0
    tz = 0.8 + PH + 1.4
    hbox("chalk", "hq.tower", 14, 2, TW, TD, TH, z=tz)
    # navy corner fins give the tower an edge against a dark page
    for sx in (-1, 1):
        hbox("navy_lit", f"hq.tower.fin.{'p' if sx > 0 else 'n'}",
             14 + sx * (TW / 2 - 1.0), 2, 2.2, TD + 1.2, TH, z=tz)
    # glazing bands
    for i in range(1, int(TH // 7)):
        hbox("window", f"hq.tower.band.{i}", 14, 2, TW * 0.96, TD * 1.01, 2.4,
             z=tz + i * 7)
    # crown, set back again
    hbox("navy_lit", "hq.tower.crown", 14, 2, TW * 0.7, TD * 0.7, 7.0, z=tz + TH)
    hbox("gold", "hq.tower.mast", 14, 2, 1.2, 1.2, 12.0, z=tz + TH + 7)

    # entrance canopy on the podium's front face
    hbox("chalk", "hq.canopy", -14, -PD / 2 - 6, 30, 13, 1.1, z=9.6)
    for i in range(4):
        keep(add("cyl", "steel", f"hq.canopy.col.{i}",
                 (cx - 26 + i * 8, cy - PD / 2 - 10.5, 5.2), (1.1, 1.1, 8.6)))
    # signage block by the door
    hbox("gold", "hq.sign", -34, -PD / 2 - 12, 9, 1.4, 5.0, z=0.9)

    # roof plant on the podium
    for i, (ox, oy, w, d, h) in enumerate(((-26, 12, 10, 8, 4), (-14, 14, 7, 7, 3),
                                           (-30, -6, 8, 6, 3.4))):
        hbox("steel", f"hq.plant.{i}", ox, oy, w, d, h, z=0.8 + PH + 1.4)

    # forecourt: a few cars and trees for scale, the way the reference sizes its own
    for i, ox in enumerate((-40, -28, -16, 20, 32)):
        hbox("navy_lit" if i % 2 else "steel", f"hq.car.{i}", ox, -40, 5.4, 2.6, 1.9, z=1.0)
    for i, (ox, oy) in enumerate(((44, -26), (50, -8), (46, 12), (-52, -30), (-56, -8))):
        keep(add("cyl", "steel", f"hq.tree.trunk.{i}", (cx + ox, cy + oy, 3.0),
                 (1.0, 1.0, 6.0)))
        keep(add("sphere", "crop", f"hq.tree.top.{i}", (cx + ox, cy + oy, 8.0),
                 (9.0, 9.0, 9.0)))

    # flag poles
    for i, ox in enumerate((-46, -50, -54)):
        keep(add("cyl", "pale", f"hq.flag.{i}", (cx + ox, cy - 22, 11), (0.7, 0.7, 22)))
    return made, subject


bpy.context.view_layer.update()  # parenting has to settle before matrix_world is real

ASPECT = 16 / 9


def to_web(v):
    """Blender is Z-up; glTF (and so three.js) is Y-up, and the exporter converts the
    geometry. The stops have to make the same trip or the camera ends up in a
    different world from the model."""
    return [round(v.x, 2), round(v.z, 2), round(-v.y, 2)]


def from_web(t):
    """Inverse of to_web, so the preview renders through the exact numbers the site
    will use — a stop that looks right here cannot be wrong in the browser."""
    return Vector((t[0], -t[2], t[1]))


def bounds(objects):
    lo = [1e9, 1e9, 1e9]
    hi = [-1e9, -1e9, -1e9]
    for ob in objects:
        for corner in ob.bound_box:
            w = ob.matrix_world @ Vector(corner)
            for i in range(3):
                lo[i] = min(lo[i], w[i])
                hi[i] = max(hi[i], w[i])
    return Vector(lo), Vector(hi)


def frame(zone_key, objects, azimuth, elevation, fov, margin=1.12, bias=0.26,
          aspect=ASPECT):
    """Place the camera so `objects` actually fill the frame.

    The box is projected onto the camera's own right/up/forward axes and fitted
    against each field of view separately. Fitting a bounding *sphere* instead
    pushes the camera absurdly far back for a wide, flat subject — which is every
    zone here. Because it is solved from real geometry, moving or resizing anything
    re-frames itself on the next build.

    `bias` aims a little left of the subject, pushing it right of centre and leaving
    the left third clear for the copy panel — the reference's layout.
    """
    lo, hi = bounds(objects)
    centre = (lo + hi) / 2
    # aim below the middle so the massing reads upward out of the frame
    centre.z = lo.z + (hi.z - lo.z) * 0.42

    a, e = math.radians(azimuth), math.radians(elevation)
    # unit vector from the subject out to the camera
    out = Vector((math.cos(a) * math.cos(e), math.sin(a) * math.cos(e), math.sin(e)))
    view = -out
    right = view.cross(Vector((0, 0, 1)))
    right.normalize()
    up = right.cross(view)
    up.normalize()

    half_w = half_h = depth = 0.0
    for cx_, cy_, cz_ in ((x, y, z) for x in (lo.x, hi.x) for y in (lo.y, hi.y)
                          for z in (lo.z, hi.z)):
        v = Vector((cx_, cy_, cz_)) - centre
        half_w = max(half_w, abs(v.dot(right)))
        half_h = max(half_h, abs(v.dot(up)))
        depth = max(depth, v.dot(view))

    shift = half_w * bias
    hfov = math.radians(fov)
    vfov = 2 * math.atan(math.tan(hfov / 2) / aspect)
    distance = margin * max(
        (half_w + shift) / math.tan(hfov / 2),
        half_h / math.tan(vfov / 2),
    ) + depth

    position = centre + out * distance
    target = centre - right * shift
    # where the marker's leader line lands: the top of the subject, not its middle
    anchor = Vector((centre.x, centre.y, hi.z))

    return {
        "id": zone_key,
        "position": to_web(position),
        "target": to_web(target),
        "anchor": to_web(anchor),
        "fov": round(fov, 2),
    }


ALL_OBJECTS = [ob for obs in _zone_objects.values() for ob in obs]

STOPS = [
    frame("overview", ALL_OBJECTS, azimuth=-72, elevation=34, fov=46, margin=1.12, bias=0.0),
    frame("business", _zone_objects["business"], azimuth=-58, elevation=24, fov=38),
    frame("ict", _zone_objects["ict"], azimuth=-104, elevation=30, fov=40),
    frame("engineering", _zone_objects["engineering"], azimuth=-46, elevation=26, fov=39),
    frame("agriculture", _zone_objects["agriculture"], azimuth=-14, elevation=28, fov=40),
    frame("energy", _zone_objects["energy"], azimuth=-138, elevation=25, fov=39),
]

with open(os.path.join(OUT_SRC, "camera-stops.json"), "w", encoding="utf-8") as f:
    json.dump({"stops": STOPS}, f, indent=2)

# ==========================================================================
# render previews so the framing can actually be looked at
# ==========================================================================
cam_data = bpy.data.cameras.new("camera")
cam = bpy.data.objects.new("camera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam


def aim(camera, position, target, fov_deg):
    """Point the camera down its -Z at the target, +Y up — the same convention
    three.js' lookAt uses, so the JSON means the same thing in both engines."""
    camera.location = position
    camera.data.sensor_fit = "HORIZONTAL"
    camera.data.angle = math.radians(fov_deg)
    # Blender defaults the far clip to 100m. Every stop here sits hundreds of metres
    # out, so without this the scene is quietly culled away to nothing.
    camera.data.clip_start = 1.0
    camera.data.clip_end = 6000.0
    direction = Vector(target) - Vector(position)
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


if PREVIEW:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.eevee.taa_render_samples = 16 if FAST else 64
    # raytraced shadows and AO are most of what separates this from flat shading
    scene.eevee.use_raytracing = True
    scene.eevee.use_shadows = True
    scene.view_settings.view_transform = "Standard"
    scene.render.resolution_x = 960 if FAST else 1440
    scene.render.resolution_y = 540 if FAST else 810
    scene.render.image_settings.file_format = "PNG"
    for s in STOPS:
        aim(cam, from_web(s["position"]), from_web(s["target"]), s["fov"])
        bpy.context.view_layer.update()
        print(
            "STOP", s["id"],
            "loc", [round(v) for v in cam.location],
            "rot_deg", [round(math.degrees(v)) for v in cam.rotation_euler],
            "hfov", round(math.degrees(cam.data.angle)),
            "fit", cam.data.sensor_fit,
        )
        scene.render.filepath = os.path.join(OUT_PREVIEW, f"preview-{s['id']}.png")
        bpy.ops.render.render(write_still=True)

    # --- hero plate: Nomad's own offices, alone, on transparency ----------
    # The hero sits on the dark theme, so the plate cannot carry a background of its
    # own or it reads as a white box pasted onto the page. Everything else is hidden
    # and the film goes transparent, which leaves just the building.
    hq, hq_subject = build_hq(0.0, -1400.0)
    # objects created after the last update still carry a stale matrix_world, and
    # framing off that puts the camera at the origin looking at nothing
    bpy.context.view_layer.update()

    hq_set = set(hq)
    hidden = []
    for ob in scene.objects:
        if ob.type == "MESH" and ob not in hq_set:
            ob.hide_render = True
            hidden.append(ob)

    # rendered square, so it has to be fitted square — the default 16:9 would push
    # the camera far enough back to leave the building a stamp in the middle
    hero = frame("hero", hq_subject, azimuth=-64, elevation=22, fov=34,
                 margin=1.04, bias=0.0, aspect=1.0)
    aim(cam, from_web(hero["position"]), from_web(hero["target"]), hero["fov"])
    scene.render.film_transparent = True
    scene.render.resolution_x = 1500
    scene.render.resolution_y = 1500
    scene.render.filepath = os.path.join(OUT, "hero-hq.png")
    bpy.ops.render.render(write_still=True)

    scene.render.film_transparent = False
    scene.render.resolution_x = 960 if FAST else 1440
    scene.render.resolution_y = 540 if FAST else 810
    for ob in hidden:
        ob.hide_render = False
    for ob in hq:
        bpy.data.objects.remove(ob, do_unlink=True)

    # The roof lift is the one moment the rig changes the model rather than the
    # camera, so check the interior is worth revealing before shipping the GLB.

    ict = next(s for s in STOPS if s["id"] == "ict")
    roof = bpy.data.objects["anim_roof_ict"]
    roof.location.z += 70
    aim(cam, from_web(ict["position"]), from_web(ict["target"]), ict["fov"])
    scene.render.filepath = os.path.join(OUT_PREVIEW, "preview-ict-open.png")
    bpy.ops.render.render(write_still=True)
    roof.location.z -= 70

# ==========================================================================
# export
# ==========================================================================
glb = os.path.join(OUT, "nomad-scene.glb")
bpy.ops.export_scene.gltf(
    filepath=glb,
    export_format="GLB",
    export_apply=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_cameras=False,
    export_lights=False,
    export_yup=True,
)

tri = sum(len(o.data.loop_triangles) for o in scene.objects
          if o.type == "MESH" and o.data.loop_triangles is not None)
print("BUILD_OK",
      "objects=", len([o for o in scene.objects if o.type == "MESH"]),
      "glb_kb=", round(os.path.getsize(glb) / 1024, 1))
