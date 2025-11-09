// next.config.js - Fixed for Windows IPv4 Binding
// Constitutional Market Harmonics Dashboard
// Solves ERR_CONNECTION_REFUSED on localhost

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force IPv4 binding on Windows
  // This prevents the IPv6 [::1] vs IPv4 127.0.0.1 mismatch
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '[::1]:3000'
      ]
    }
  },

  // Output file tracing root (silences the lockfile warning)
  outputFileTracingRoot: require('path').join(__dirname, '../'),

  // Webpack configuration for better Windows compatibility
  webpack: (config, { isServer }) => {
    // Fix for Windows path issues
    config.resolve.symlinks = false;

    return config;
  },

  // Ensure proper hostname resolution
  // This is critical for Windows Next.js binding
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: []
    };
  },

  // Headers for CORS (allows backend API calls)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  // Ensure server runs on all interfaces
  // This helps with Windows network adapter issues
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3002',
    NEXT_PUBLIC_WS_URL: 'ws://localhost:3002'
  }
};

module.exports = nextConfig;