import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The standalone about page folded into the landing page.
      { source: "/about", destination: "/#about", permanent: true },
    ];
  },
};

export default nextConfig;
