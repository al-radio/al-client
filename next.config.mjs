/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "i.scdn.co" }],
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle .woff2 files
    config.module.rules.push({
      test: /\.woff2$/,
      use: {
        loader: "url-loader", // or 'file-loader'
        options: {
          limit: 10000, // Limit in bytes for inlining files as Base64 (optional)
          mimetype: "font/woff2", // Specify the MIME type
          name: "[name].[hash].[ext]", // Output format
          outputPath: "static/fonts/", // Output directory
          publicPath: "/_next/static/fonts/", // Public path
        },
      },
    });

    return config;
  },
};

export default nextConfig;
