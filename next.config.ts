import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* The parent folder has its own package-lock.json (Playwright, used for the audit
     scripts), so Next guesses the wrong workspace root. Pin it to this app. */
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
