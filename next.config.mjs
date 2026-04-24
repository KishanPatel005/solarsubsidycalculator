/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Back-compat / requested URLs:
      // /solar-subsidy-gujarat -> /solar-subsidy/gujarat
      {
        source: "/solar-subsidy-:state",
        destination: "/solar-subsidy/:state",
      },
    ];
  },
  webpack(config, { dev }) {
    // On some Windows setups, webpack's persistent pack cache can get into an
    // ENOENT loop (missing *.pack.gz) and break serving /_next/static/* (CSS/JS 404).
    // Disabling cache in dev keeps HMR stable and prevents blank/unstyled pages.
    if (dev) config.cache = false;
    return config;
  },
};

export default nextConfig;
