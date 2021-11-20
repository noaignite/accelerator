const defaultAlias = {
  '@noaignite/formit': './packages/formit/src',
  '@noaignite/oui': './packages/oui/src',
  '@noaignite/utils': './packages/utils/src',
  '@noaignite/react-centra-checkout': './packages/react-centra-checkout/src',
  '/test': './test',
}

const productionPlugins = [
  ['babel-plugin-react-remove-properties', { properties: ['data-ign-test'] }],
]

const useESModules = ['esm'].includes(process.env.BABEL_ENV)

const presets = [
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
  '@babel/preset-typescript',
  [
    '@babel/preset-env',
    {
      modules: useESModules ? false : 'commonjs',
      targets: {
        browsers: 'defaults, not dead, not IE 11, not op_mini all',
      },
    },
  ],
]

const plugins = [
  'babel-plugin-optimize-clsx',
  '@babel/plugin-transform-runtime',
  [
    'babel-plugin-transform-react-remove-prop-types',
    {
      mode: 'unsafe-wrap',
    },
  ],
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(...productionPlugins)
}
if (process.env.NODE_ENV === 'test') {
  plugins.push([
    'babel-plugin-module-resolver',
    {
      alias: defaultAlias,
      root: ['./'],
    },
  ])
}

module.exports = {
  presets,
  plugins,
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  overrides: [
    {
      exclude: /\.test\.(js|ts|tsx)$/,
      plugins: ['@babel/plugin-transform-react-constant-elements'],
    },
  ],
  env: {
    coverage: {
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            root: ['./'],
            alias: defaultAlias,
          },
        ],
      ],
    },
    development: {
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            root: ['./'],
            alias: defaultAlias,
          },
        ],
      ],
    },
    test: {
      sourceMaps: 'both',
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            root: ['./'],
            alias: defaultAlias,
          },
        ],
      ],
    },
  },
}
