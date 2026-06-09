/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

// Disable separate compiler workers to avoid SIGBUS crash
// in containerized/WSL environments (Next.js 14.2 bug)
process.env.NEXT_DISABLE_WORKERS = "1";

export default nextConfig;
