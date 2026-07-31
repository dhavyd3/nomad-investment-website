/**
 * Zone data for the services board.
 *
 * Deliberately its own module with no "use client": the page is a server component and
 * renders this list directly. Importing it from the scene component instead hands the
 * server a client-reference proxy rather than the array, and `ZONES.map` is not a
 * function on a proxy.
 */
export type Zone = {
  id: string;
  index: string;
  title: string;
  body: string;
  /** where the zone sits on the board */
  at: [number, number];
  /** camera rectangle, in scene units */
  box: [number, number, number, number];
};

export const ZONES: Zone[] = [
  {
    id: "business",
    index: "01",
    title: "Business Consulting & Investor Relations",
    body:
      "Tailored, results-driven consulting that helps organisations unlock their full potential — strategy, structure and the partnerships that turn intent into delivered work. We sit on the same side of the table as the people carrying the risk.",
    at: [380, 300],
    /* Boxes are sized to the zone's projected bounding box (~240 units) plus breathing
       room, not to the board. A 900-wide box left each zone filling a tenth of the frame. */
    box: [190, 159, 360, 240],
  },
  {
    id: "ict",
    index: "02",
    title: "ICT Consultancy, AI & Cybersecurity",
    body:
      "IT strategy, system integration, penetration testing and incident response. The work that keeps an organisation running is mostly invisible until it stops — so we build it to be dull, documented and defensible.",
    at: [1280, 250],
    box: [1112, 163, 360, 240],
  },
  {
    id: "engineering",
    index: "03",
    title: "Engineering & Infrastructure",
    body:
      "Construction and infrastructure delivery held to a quality, innovation and sustainability standard that does not move with the schedule. From site works to structures, we take on the delivery rather than supervise it.",
    at: [2000, 440],
    box: [1833, 302, 360, 240],
  },
  {
    id: "agriculture",
    index: "04",
    title: "Agricultural Services & Consultancy",
    body:
      "Comprehensive agricultural services — improving productivity and infrastructure through practical innovation. Advisory that survives contact with the field, from soil and inputs through to route to market.",
    at: [520, 1020],
    box: [355, 932, 360, 240],
  },
  {
    id: "energy",
    index: "05",
    title: "Oil, Gas & Green Energy",
    body:
      "Helping clients navigate the complexities of the oil and gas sector, alongside environmental assessment and green energy advisory — because the two are one conversation now, not two.",
    at: [1720, 1060],
    box: [1555, 969, 360, 240],
  },
];

/** Establishing shot — has to contain every zone box, at the same 3:2. */
export const OVERVIEW: [number, number, number, number] = [120, 90, 2160, 1440];
