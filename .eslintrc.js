module.exports = {
  env: {
    jest: true,
  },
  extends: [
    '@stdjs',
    '@stdjs/eslint-config/typescript',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
