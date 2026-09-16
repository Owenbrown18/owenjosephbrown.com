import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The standalone about page folded into the landing page.
      { source: "/about", destination: "/#about", permanent: true },
      // Client site write-ups moved to the business site, which has one
      // for every client rather than three of them. Old links still land.
      ...["grain-construction", "figs-and-honey", "daves-bakery"].map(
        (slug) => ({
          source: `/work/${slug}`,
          destination: `https://www.obwebdesign.ca/work/${slug}`,
          permanent: true,
        }),
      ),
    ];
  },
};

export default nextConfig;
