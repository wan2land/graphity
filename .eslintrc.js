module.exports = {
  env: {
    jest: true,
  },
  extends: [
    '@stdjs',
    '@stdjs/eslint-config/typescript',
  ],
  ignorePatterns: [
    'node_modules/',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
}
