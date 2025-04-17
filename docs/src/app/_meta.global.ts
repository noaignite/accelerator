const packages = [
  'centra-mocks',
  'centra-types',
  'create-app',
  'react-centra-checkout',
  'react-utils',
  'style-guide',
  'tailwind-typography',
  'types',
  'utils',
]

const packagesWithExports = [
  'react-centra-checkout',
  'react-utils',
  'tailwind-typography',
  'types',
  'utils',
]

export default {
  contact: {
    type: 'page',
    title: 'Contact us',
    href: 'https://www.noaignite.se/contact',
  },
  README: 'Getting Started',
  CONTRIBUTING: 'Contributing',
  '-': {
    type: 'separator',
    title: 'Packages',
  },
  ...packages.reduce(
    (acc, title) => ({
      ...acc,
      [title]: {
        title,
        items: {
          README: 'Getting Started',
          ...(packagesWithExports.includes(title) && {
            '-': {
              type: 'separator',
              title: 'Exports',
            },
          }),
        },
      },
    }),
    {},
  ),
}
