import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.12.244"],
  devIndicators: false,
  experimental: {
    /**
     * TURBOPACK'S ON-DISK DEV CACHE, OFF ON PURPOSE.
     *
     * Default `true` since Next 16.1 (`server/config-shared.js`), which is when
     * `next dev` gained the ability to hand back an artifact that no longer
     * matches the source. The failure never errors: the server keeps serving,
     * the page keeps rendering, and one file's most recent edit simply is not
     * in the bundle. Seen twice on `globals.css` - 2026-08-10, where the served
     * stylesheet was byte-identical across several edits, and 2026-08-16, where
     * a new suite's token and keyframes were served but its selector rules were
     * not.
     *
     * IT PRESENTS AS BROKEN CSS, which is what makes it expensive. The obvious
     * reading of "the rule does nothing" is that the rule is wrong, so the time
     * goes on rewriting correct code. It also survives a restart, because the
     * cache is on disk - which is why `npm run dev:fresh` exists and why a plain
     * restart is not a reliable fix.
     *
     * The cost is slower cold starts. That is a worthwhile trade here: an
     * unusual amount of this project's correctness lives in one stylesheet - the
     * colour recipes and all five motion suites are selectors and custom
     * properties in `globals.css` - so a stale stylesheet is not a cosmetic
     * problem, it is the system silently not being the system.
     *
     * `npm run css:verify` is the check that works whatever the cause.
     */
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
