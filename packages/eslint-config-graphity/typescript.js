
const extensions = [
  '.mjs',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.d.ts',
]

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  settings: {
    'import/extensions': extensions,
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
    },
    'import/resolver': {
      node: {
        extensions,
      },
    },
  },
  rules: {
    // Do not remove comments
    // used for comparison.

    // overloading
    'no-dupe-class-members': 'off',
    'import/export': 'off',

    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/await-thenable': 'warn',
    // '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': 'error',
    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'camelcase': 'off',
    '@typescript-eslint/camelcase': 'error',
    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': 'error',
    '@typescript-eslint/generic-type-naming': 'error',
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1, flatTernaryExpressions: true }],
    // '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma',
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
      overrides: {
        interface: {
          multiline: {
            delimiter: 'none',
          },
        },
      },
    }],
    // '@typescript-eslint/member-naming': 'off',
    '@typescript-eslint/member-ordering': ['error', {
      default: [
        'public-static-field',
        'protected-static-field',
        'private-static-field',

        'static-field',

        'public-static-method',
        'protected-static-method',
        'private-static-method',

        'static-method',

        'public-instance-field',
        'protected-instance-field',
        'private-instance-field',

        'public-field',
        'protected-field',
        'private-field',

        'instance-field',

        'field',

        'constructor',

        'public-instance-method',
        'protected-instance-method',
        'private-instance-method',

        'public-method',
        'protected-method',
        'private-method',

        'instance-method',

        'method',
      ],
    }],
    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    // '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-parens': ['warn', 'all', { returnAssign: false }],
    'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    // '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    // 'no-magic-numbers': 'off',
    // '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-misused-promises': ['warn', { checksConditionals: true }],
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-parameter-properties': ['error', { allows: ['public', 'public readonly'] }],
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    // '@typescript-eslint/no-throw-literal': 'off',
    // '@typescript-eslint/no-type-alias': 'off',
    '@typescript-eslint/no-unnecessary-condition': ['warn', { allowConstantLoopConditions: true }],
    // '@typescript-eslint/no-unnecessary-qualifier': 'off',
    // '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',

    '@typescript-eslint/no-untyped-public-signature': 'warn',
    // '@typescript-eslint/no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    // '@typescript-eslint/no-unused-vars-experimental': 'off',
    // 'no-use-before-define': 'off',
    // '@typescript-eslint/no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    // '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    // '@typescript-eslint/prefer-includes': 'off', // use in unicorn/prefer-include
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': ['warn', { forceSuggestionFixer: false }],
    '@typescript-eslint/prefer-optional-chain': 'warn',
    // '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'warn',
    '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
    // '@typescript-eslint/promise-function-async': 'off',
    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    // '@typescript-eslint/require-array-sort-compare': 'off',
    'require-await': 'off',
    '@typescript-eslint/require-await': 'warn',
    // '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
    // '@typescript-eslint/return-await': 'off',
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
    // '@typescript-eslint/strict-boolean-expressions': 'off',
    // '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/type-annotation-spacing': 'error',
    // '@typescript-eslint/typedef': 'off',
    // '@typescript-eslint/unbound-method': 'off',
    // '@typescript-eslint/unified-signatures': 'off',
  },
}
