module.exports = {
  env: {
    jest: true,
  },
  extends: [
    'stable',
    'stable/typescript',
  ],
  ignorePatterns: [
    'node_modules/',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/ban-types': ['error', {
      types: {
        Function: false,
      },
      extendDefaults: true,
    }]
  },
}
