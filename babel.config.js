let defaultPresets

if (process.env.BABEL_ENV === 'es') {
  defaultPresets = []
} else {
  defaultPresets = [
    [
      '@babel/preset-env',
      {
        modules: ['esm'].includes(process.env.BABEL_ENV) ? false : 'commonjs',
      },
    ],
  ]
}

const productionPlugins = [
  'babel-plugin-transform-react-constant-elements',
  'babel-plugin-transform-dev-warning',
  [
    'babel-plugin-transform-react-remove-prop-types',
    {
      mode: 'unsafe-wrap',
    },
  ],
]

module.exports = {
  presets: defaultPresets.concat(['@babel/preset-react']),
  plugins: [
    'babel-plugin-optimize-clsx',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    '@babel/plugin-transform-runtime',
    // for IE 11 support
    '@babel/plugin-transform-object-assign',
  ],
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  env: {
    cjs: {
      plugins: productionPlugins,
    },
    esm: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
    },
    es: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
    },
    production: {
      plugins: [...productionPlugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
    },
  },
}
