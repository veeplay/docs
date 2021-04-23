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
    };
  },
});
