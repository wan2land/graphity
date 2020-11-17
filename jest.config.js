module.exports = {
  preset: 'ts-jest',
  testRegex: '[^/]*\\.test.tsx?$',
  setupFilesAfterEnv: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}
