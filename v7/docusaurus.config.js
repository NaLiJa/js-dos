module.exports = {
  title: 'js-dos v7',
  tagline: 'The simpliest API to run DOS games in browser',
  url: 'https://js-dos.com',
  baseUrl: '/v7/build/',
  favicon: 'img/favicon.ico',
  organizationName: 'caiiiycuk',
  projectName: 'js-dos',
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-178018235-1',
    },
    navbar: {
      title: 'js-dos',
      logo: {
        alt: 'js-dos logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/caiiiycuk/js-dos',
          label: 'GitHub',
          position: 'right',
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
              label: 'Overview',
              to: 'docs/',
            },
            {
              label: 'Releases',
              to: 'docs/releases',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Bundles Repository',
              href: 'https://talks.dos.zone/t/collections/44653',
            },
            {
              label: 'Dos.Zone',
              href: 'https://dos.zone',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/caiiiycuk/js-dos',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/hMVYEbG',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/doszone_db',
            },
          ],
        },
      ],
      copyright: `${new Date().getFullYear()}, @caiiiycuk`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          homePageId: 'overview',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/caiiiycuk/js-dos/edit/gh-pages/v7/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
