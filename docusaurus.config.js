/** @type {import('@docusaurus/types').DocusaurusConfig} */

const path = require('path');

module.exports = {
  title: 'Veeplay Documentation',
  tagline: 'References and Guides for the Veeeplay Video SDKs and APIs',
  url: 'https://docs.veeplay.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'veeplay',
  projectName: 'docs',
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: {
      additionalLanguages: ['java', 'swift'],
    },
    navbar: {
      title: 'Veeplay Docs',
      style: 'dark',
      logo: {
        alt: 'Veeplay',
        src: 'img/logo.png',
      },
      items: [
        {
          position: 'left',
          label: 'Video Guides',
          type: 'doc',
          docId: 'video-guides/how-video-streaming-works',
        },
        {
          position: 'left',
          label: 'FAQ',
          type: 'doc',
          docId: 'faq/transcoding-api',
        },
        {
          position: 'left',
          label: 'Video API',
          to: '/video-api/',
        },
        {
          position: 'left',
          label: 'SSAI',
          type: 'doc',
          docId: 'ssai/index',
        },
        {
          position: 'left',
          label: 'Video Player',
          items: [
            {
              label: 'JavaScript Reference',
              to: '/javascript-player/',
            },
            {
              label: 'iOS Reference',
              to: '/ios-player/readme.html',
            },
            {
              label: 'Android Reference',
              to: '/android-player/',
            },
            {
              label: 'JSON Configs Reference',
              to: '/json-configuration/',
            },
            {
              label: 'Events Reference',
              to: '/docs/video-player/events',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Video API',
              to: '/video-api/',
            },
            {
              label: 'Server-Side Ad Insertion',
              to: '/docs/ssai/index',
            },
            {
              label: 'JavaScript Video Player',
              to: '/javascript-player/',
            },
            {
              label: 'iOS Video Player',
              to: '/ios-player/readme.html',
            },
            {
              label: 'Android Video Player',
              to: '/android-player/',
            },
            {
              label: 'JSON Configuration',
              to: '/json-configuration/',
            },
          ],
        },
        {
          title: 'Guides to Video',
          items: [
            {
              label: 'Video Streaming',
              to: '/docs/video-guides/how-video-streaming-works',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Homepage',
              href: 'https://veeplay.com',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/veeplay',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Veeplay.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/veeplay/docs/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [{
          spec: './sources/videoapi/swagger.yaml',
          routePath: '/video-api',
        }],
        theme: {
          primaryColor: '#393939',
          redocOptions: {
            expandResponses: 'all',
            pathInMiddlePanel: true,
            disableSearch: true,
          },
        },
      },
    ],
  ],
  plugins: [
    path.resolve(__dirname, 'plugins', 'webpack-config-plugin'),
    path.resolve(__dirname, 'plugins', 'script-inject-plugin'),
  ],
};
