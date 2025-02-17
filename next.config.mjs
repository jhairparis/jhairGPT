/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.jhairparis.com",
        pathname: "/chats/**",
      },
    ],
  },
};

export default nextConfig;
