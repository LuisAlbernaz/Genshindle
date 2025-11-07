import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
  images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.genshin-builds.com' },
    { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
  ],
}
};

export default nextConfig;
