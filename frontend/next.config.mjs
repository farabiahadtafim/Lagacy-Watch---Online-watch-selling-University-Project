/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5001' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*'
      },
      {
        source: '/product-images/:path*',
        destination: 'http://localhost:5001/product-images/:path*'
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5001/uploads/:path*'
      }
    ];
  },
};

export default nextConfig;
