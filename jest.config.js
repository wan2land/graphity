module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: '.babelrc',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '[^/]*\\.test.tsx?$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
}
