/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy PHP sitemap URL -> Next sitemap
      {
        source: "/sitemap.php",
        destination: "/sitemap.xml",
        permanent: true,
      },
      // Migrate /solar-subsidy/[state] -> /solar-subsidy-[state]
      {
        source: "/solar-subsidy/:state((?!news$|news/.*)[a-z-]+)",
        destination: "/solar-subsidy-:state",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // City pages (top 20) under /solar-subsidy-[city]
      {
        source:
          "/solar-subsidy-:city(ahmedabad|mumbai|delhi|bangalore|pune|hyderabad|chennai|jaipur|lucknow|surat|kolkata|chandigarh|indore|bhopal|nagpur|vadodara|coimbatore|patna|jodhpur|agra)",
        destination: "/solar-city/:city",
      },
    ];
  },
  images: {
    formats: ["image/webp"],
    deviceSizes: [375, 640, 750, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256],
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
