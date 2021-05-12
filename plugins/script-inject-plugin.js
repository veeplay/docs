module.exports = () => ({
  name: 'script-inject',
  injectHtmlTags() {
    return {
      headTags: [
        `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-114384176-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-114384176-1', {
    'linker': {
      'domains': ['veeplay.com', 'docs.veeplay.com', 'panel.veeplay.com']
    }
  });
</script>
        `,
      ],
    };
  },
});
