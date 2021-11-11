const defaultAlias = {
  '@noaignite/formit': './packages/formit/src',
  '@noaignite/oui': './packages/oui/src',
  '@noaignite/utils': './packages/utils/src',
  '/test': './test',
}

const productionPlugins = [
  ['babel-plugin-react-remove-properties', { properties: ['data-testid'] }],
]

const useESModules = ['esm'].includes(process.env.BABEL_ENV)

const presets = [
  [
    '@babel/preset-env',
    {
      // bugfixes: true,
      // browserslistEnv: process.env.BABEL_ENV || process.env.NODE_ENV,
      modules: useESModules ? false : 'commonjs',
      // shippedProposals: api.env('modern'),
    },
  ],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
]

const plugins = [
  'babel-plugin-optimize-clsx',
  // Need the following 3 proposals for all targets in .browserslistrc.
  // With our usage the transpiled loose mode is equivalent to spec mode.
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  ['@babel/plugin-proposal-private-methods', { loose: true }],
  ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
  [
    '@babel/plugin-transform-runtime',
    {
      useESModules,
      // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
      version: '^7.4.4',
    },
  ],
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
