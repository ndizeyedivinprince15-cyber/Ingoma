/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpiler le package shared du monorepo
  transpilePackages: ['@aidesmax/shared'],
 
  
  // Redirections
  async redirects() {
    return [];
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
