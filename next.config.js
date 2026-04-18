// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8000",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      // ✅ Add this for Vercel backend
      {
        protocol: "https",
        hostname: "ar-menu-hazel.vercel.app",
        pathname: "/**",
      },
      // ✅ Add this for base64 data URLs (your QR codes)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // ✅ Allow base64 data URLs for QR codes
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};
module.exports = nextConfig;
