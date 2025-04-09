/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Server Actions in GitHub Codespaces and other proxied environments
  experimental: {
    serverActions: {
      allowedOrigins: [
       'localhost:3000',
      'localhost',
      'https://orange-space-potato-5vrwr9jq59xfv6jw-3000.app.github.dev/',
      '127.0.0.1:3000',
      '127.0.0.1',
      '.app.github.dev',  // Allow GitHub Codespaces URLs
      '.github.dev',      // More general GitHub Codespaces pattern
      '*.app.github.dev', // Any subdomain of app.github.dev
      '*.preview.app.github.dev', // Preview environments
      ],
    },
  },
  // Add CSRF protection bypass for development in GitHub Codespaces
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config) => {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 800,
      };
      return config;
    },
  }),
};

export default nextConfig;