import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// request.ts yolunu buraya verdik:
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" }
    ]
  }
};

export default withNextIntl(nextConfig);
