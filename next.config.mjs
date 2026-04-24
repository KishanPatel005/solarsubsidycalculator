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
};

export default nextConfig;
