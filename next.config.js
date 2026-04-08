/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Allow local images with spaces in filenames
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },
}

module.exports = nextConfig
