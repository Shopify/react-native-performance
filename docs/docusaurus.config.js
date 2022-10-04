const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

module.exports = {
  title: 'React Native Performance',
  tagline: 'Performance monitoring for React Native apps',
  url: 'https://shopify.github.io/',
  baseUrl: '/react-native-performance/',
  onBrokenLinks: 'error',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Shopify',
  projectName: 'react-native-performance',
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    prism: {
      additionalLanguages: ['ruby', 'sql'],
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    navbar: {
      title: 'React Native Performance',
      logo: {
        alt: 'React Native Performance',
        src: 'img/icon.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'welcome',
          position: 'left',
          label: 'Docs',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/shopify/react-native-performance',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',

      links: [
        {
          title: 'Docs',
          items: [{label: 'Quick Start', to: 'docs/fundamentals/getting-started'}],
        },
        {
          title: 'Community',
          items: [{label: 'Discord', href: 'https://discord.com/channels/928252803867107358/928253059375726622'}],
        },
        {
          title: 'More',
          items: [{label: 'GitHub', href: 'https://github.com/Shopify/react-native-performance'}],
        },
      ],

      copyright: `Copyright © ${new Date().getFullYear()} Shopify Inc. Built with Docusaurus.`,
    },
  },
  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        docsDir: 'docs',
        indexPages: true,
        docsRouteBasePath: '/',
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/shopify/react-native-performance/edit/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'docusaurus-preset-shiki-twoslash',
      {
        themes: ['min-light', 'nord'],
      },
    ],
  ],
};
