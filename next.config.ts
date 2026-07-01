import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Short, say-out-loud vanity URLs for the HMSDC MBE Leadership Academy room.
      // Temporary so they can be repointed to a different kit for a future event.
      {
        source: '/hmsdc',
        destination: '/kits/supplier-readiness-builder',
        permanent: false,
      },
      {
        source: '/kits/mbe',
        destination: '/kits/supplier-readiness-builder',
        permanent: false,
      },
      // Catch the singular "kit/..." mistype and send it to the real plural route.
      {
        source: '/kit/:slug*',
        destination: '/kits/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
