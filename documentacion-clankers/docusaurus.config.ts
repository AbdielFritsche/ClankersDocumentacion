import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Documentacion Clankers',
  tagline: 'Acceso a la implementación del proyecto Clankers',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'proyecto',
        path: 'docs/Proyecto',
        routeBasePath: 'proyecto',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'escenario',
        path: 'docs/Escenario',
        routeBasePath: 'escenario',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'implementacion',
        path: 'docs/Implementacion',
        routeBasePath: 'implementacion',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    /*[
      '@docusaurus/plugin-content-docs',
      {
        id: 'nosotros',
        path: 'docs/Nosotros',
        routeBasePath: 'nosotros',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],*/
  ],
  
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'My Site Logo',
        src: 'img/clanker.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'proyectoSidebar', // <-- El ID de tu sidebar.js
          docsPluginId: 'proyecto',      // <-- El ID de tu plugin
          position: 'left',
          label: 'Proyecto',
        },
        {
          type: 'docSidebar',
          sidebarId: 'escenarioSidebar',
          docsPluginId: 'escenario',
          position: 'left',
          label: 'Escenario',
        },
        {
          type: 'docSidebar',
          sidebarId: 'implementacionSidebar',
          docsPluginId: 'implementacion',
          position: 'left',
          label: 'Implementación',
        },
        /*{
          type: 'docSidebar',
          sidebarId: 'nosotrosSidebar',
          docsPluginId: 'nosotros',
          position: 'left',
          label: 'Nosotros',
        },*/
      ],
    },
    footer: {
      style: 'dark',
      links: [
        
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Clankers.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
