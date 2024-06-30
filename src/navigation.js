import { getPermalink } from './utils/permalinks';
// List of all US states
const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];
export const headerData = {
  links: [
    {
      text: 'State',
      links: states.map((state) => ({
        text: state,
        href: `/state/${state.toLowerCase().replace(/ /g, '-')}/`,
      })),
    },
    {
      text: 'Create',
      href: '/evaluate',
    },
    {
      text: 'School',
      href: '/schools',
    },
    {
      text: 'Tools',
      links: [
        {
          text: 'Quiz Builder',
          href: getPermalink('/quiz_builer'),
        },
        {
          text: 'Skills (Learning Paths)',
          href: getPermalink('/learn/typescript/'),
        },
      ],
    },
  ],
  actions: [{ text: 'Search', variant: 'secondary', href: 'javascript:alert("hi")' }],
};

export const footerData = {
  links: [
    {
      title: 'Platform',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Customer stories', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Languages',
      links: [
        { text: 'JavaScript', href: '#' },
        { text: 'TypeScript', href: '#' },
        { text: 'Python', href: '#' },
        { text: 'SQL', href: '#' },
        { text: 'C#', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },

    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: '#' },
  ],
  footNote: `©2024 - SimpliInc. All rights reserved. `,
};
