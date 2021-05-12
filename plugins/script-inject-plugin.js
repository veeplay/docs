module.exports = () => ({
  name: 'script-inject',
  injectHtmlTags() {
    return {
      headTags: [
        `
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-2YDLGY5BJY"></script>
          <script src="/scripts/ga.js"></script>
        `,
      ],
    };
  },
});
