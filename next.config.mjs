// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'di0kc6glg2cji.cloudfront.net',
      'img.daisyui.com',
      "d48eox0ne7o48.cloudfront.net"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'di0kc6glg2cji.cloudfront.net',
        pathname: '/uploads/images/profile/**',
      },
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
