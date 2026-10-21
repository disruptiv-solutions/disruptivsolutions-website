import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/lead-finder',
        destination: '/learn/find-leads',
        permanent: true,
      },
      {
        source: '/kits/mbe',
        destination: '/learn/supplier-readiness-builder',
        permanent: false,
      },
      {
        source: '/kit/mbe',
        destination: '/learn/supplier-readiness-builder',
        permanent: false,
      },
      {
        source: '/kits/:slug*',
        destination: '/learn/:slug*',
        permanent: true,
      },
      // Keep the resource library out of the public site for now without
      // deleting its content or breaking direct workshop/class links.
      {
        source: '/resources',
        destination: '/',
        permanent: false,
      },
      // Short, say-out-loud vanity URLs for the HMSDC MBE Leadership Academy room.
      // Temporary so they can be repointed to a different kit for a future event.
      {
        source: '/hmsdc',
        destination: '/learn/supplier-readiness-builder',
        permanent: false,
      },
      // Preserve older singular kit links as well as the former /kits routes.
      {
        source: '/kit/:slug*',
        destination: '/learn/:slug*',
        permanent: true,
      },
    ];
  },
};

export default withBotId(nextConfig);
