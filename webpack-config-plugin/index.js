// eslint-disable-next-line import/no-extraneous-dependencies
const { ProvidePlugin, DefinePlugin } = require('webpack');

module.exports = () => ({
  name: 'custom-docusaurus-plugin',
  configureWebpack(config, isServer) {
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
          buffer: 'buffer',
          ...(!isServer ? { process: 'process/browser' } : {}),
        },
      },
      plugins: [
        new DefinePlugin({
          'Buffer.isBuffer': JSON.stringify('() => false'),
          'process.env': {},
          'process.platform': JSON.stringify(''),
          'process.stdout': JSON.stringify(null),
          'process.browser': JSON.stringify(true),
        }),
        new ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          ...(!isServer ? { process: 'process/browser' } : {}),
        }),
      ],
    };
  },
});
