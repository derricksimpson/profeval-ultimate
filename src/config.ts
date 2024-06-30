export const I18N = {
  language: 'en',
  textDirection: 'ltr',
};

//  values: "system" | "light" | "dark" | "light:only" | "dark:only"
export const UI = {
  theme: 'light',
};

export const SITE = {
  name: 'ProfEval',
  site: 'https://www.profeval.com',
  base: '/',
  trailingSlash: false,
  googleSiteVerificationId: 'orc',
};

export const ANALYTICS = {
  vendors: {
    googleAnalytics: {
      id: null,
      partytown: true,
    },
  },
};

export const METADATA = {
  title: {
    default: 'ProfEval',
    template: '%s — ProfEval',
  },
  description: 'Rate My Professors and Teachers with ProfEval',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    site_name: 'ProfEval',
    images: [
      {
        url: '~/assets/images/default.png',
        width: 1200,
        height: 628,
      },
    ],
    type: 'website',
  },
  twitter: {
    handle: '',
    site: '',
    cardType: 'summary_large_image',
  },
};
