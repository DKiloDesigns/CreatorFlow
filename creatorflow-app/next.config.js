/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';

const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack cache
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [fileURLToPath(import.meta.url)]
        }
      }
    }
    return config
  }
};

export default nextConfig;
