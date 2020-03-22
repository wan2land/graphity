module.exports = {
  env: {
    jest: true,
  },
  extends: [
    './packages/eslint-config-graphity/javascript.js',
    './packages/eslint-config-graphity/typescript.js',
  ],
  ignorePatterns: [
    'node_modules/',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
