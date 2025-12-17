const packages = [
  'centra-mocks',
  'centra-types',
  'create-app',
  'react-centra-checkout',
  'react-native-eslint',
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
  index: 'Getting Started',
  CONTRIBUTING: 'Contributing',
  CHANGELOG: 'Changelog',
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
          index: 'Getting Started',
          CHANGELOG: 'Changelog',
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
