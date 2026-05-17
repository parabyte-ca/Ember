import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ember/lib', '@ember/db'],
};

export default nextConfig;
