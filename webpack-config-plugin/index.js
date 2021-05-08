module.exports = () => ({
  name: 'custom-docusaurus-plugin',
  configureWebpack() {
    return {
      module: {
        rules: [
          {
            test: /\.html$/,
            loader: 'raw-loader',
          },
        ],
      },
      resolve: {
        fallback: {
          path: require.resolve('path-browserify'),
          os: require.resolve('os-browserify/browser'),
        },
      },
    };
  },
});
