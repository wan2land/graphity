module.exports = {
  env: {
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
  ],
  overrides: [
    {
      files: [
        '**/*.ts',
      ],
      extends: [
        'stable',
        'stable/typescript',
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
    },
    {
      files: [
        '**/*.js',
      ],
      extends: [
        'stable',
      ],
    },
  ],
}
