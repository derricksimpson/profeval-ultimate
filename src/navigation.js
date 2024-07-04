import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'States',
      href: '/states',
    },
    {
      text: 'Create',
      href: '/evaluate',
    },
    {
      text: 'School',
      href: '/school',
    },
    // {
    //   text: 'Tools',
    //   links: [
    //     {
    //       text: 'Quiz Creator',
    //       href: '/tools/quiz_creator',
    //     },
    //     {
    //       text: 'Test Creator',
    //       href: '/tools/test_creator',
    //     },
    //     {
    //       text: 'Skills (Learning Paths)',
    //       href: '/learn/typescript/',
    //     },
    //   ],
    // },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Platform',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },

    // {
    //   title: 'Tools',
    //   links: [
    //     { text: 'Quiz Creator', href: '#' },
    //     { text: 'Test Creator', href: '#' },
    //     { text: 'Test Practice', href: '#' },
    //   ],
    // },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    // { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },

    // { ariaLabel: 'Github', icon: 'tabler:brand-github', href: '#' },
  ],
  footNote: `©2024 - Profeval. All rights reserved. `,
};
