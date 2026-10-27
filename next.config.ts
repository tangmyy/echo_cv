import type { NextConfig } from "next";

const mapboxPublicToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();
if (mapboxPublicToken && !mapboxPublicToken.startsWith("pk.")) {
  throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN must be a public pk. token, never a secret token.");
}

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
