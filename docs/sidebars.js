/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      label: 'Welcome',
      id: 'welcome',
    },
    {
      collapsed: true,
      type: 'category',
      label: '🛠 Fundamentals',
      items: [
        'fundamentals/getting-started',
        'fundamentals/render-pass-report',
        'fundamentals/state-machine',
        'fundamentals/debugging',
        'fundamentals/measuring-render-times',
        'fundamentals/render-watchdog-timers',
        'fundamentals/monitoring-internal-state',
        'fundamentals/error-handling',
        'fundamentals/global-switch',
        'fundamentals/stubbing-in-test',
        'fundamentals/optimizing-long-running-components',
      ],
    },
    {
      collapsed: true,
      type: 'category',
      label: '📚 Guides',
      items: [
        'guides/react-native-performance-lists-profiler',
        'guides/flipper-react-native-performance',
        {
          collapsed: true,
          type: 'category',
          label: 'React Navigation',
          items: [
            'guides/react-native-performance-navigation/getting-started',
            'guides/react-native-performance-navigation/profiling-navigation',
            'guides/react-native-performance-navigation/best-practices',
            'guides/react-native-performance-navigation/react-native-performance-navigation-bottom-tabs',
            'guides/react-native-performance-navigation/react-native-performance-navigation-drawer',
          ],
        },
        'guides/errors',
        'guides/reporting',
      ],
    },
    {
      collapsed: true,
      type: 'category',
      label: '🔗 Resources',
      items: ['resources/resources'],
    },
    // {
    //   collapsed: true,
    //   type: 'category',
    //   label: '🤝 Decisions',
    //   items: ['paint/overview', 'paint/properties'],
    // },
    {
      type: 'doc',
      label: 'Known issues',
      id: 'known-issues',
    },
    {
      type: 'doc',
      label: 'FAQ',
      id: 'faq',
    },
  ],
};

module.exports = sidebars;
