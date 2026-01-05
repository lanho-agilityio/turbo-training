/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TODO: Update to be more specific
    remotePatterns: [
      {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '**',
        },

  ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
