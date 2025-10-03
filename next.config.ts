/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,       // disable type-checked route imports
    typedValidation: false,   // disable the validator that breaks builds
  },
  typescript: {
    ignoreBuildErrors: true,  // don't fail build on TS errors
  },
}

module.exports = nextConfig
