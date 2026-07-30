import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* The parent folder has its own package-lock.json (Playwright, used for the audit
     scripts), so Next guesses the wrong workspace root. Pin it to this app. */
  outputFileTracingRoot: path.join(__dirname),

  /* Emit .next/standalone: a self-contained server plus only the node_modules the build
     actually traced. The container ships that instead of the full install, and because
     the resolved config is baked into the bundle the runtime never re-parses this file —
     which is what a TypeScript config needs TypeScript present at boot to do. */
  output: "standalone",
};

export default nextConfig;
