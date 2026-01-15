/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/28_youth_fe',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
