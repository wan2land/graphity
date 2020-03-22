# Graphity ESLint Config

[![Downloads](https://img.shields.io/npm/dt/eslint-config-graphity.svg?style=flat-square)](https://npmcharts.com/compare/eslint-config-graphity?minimal=true)
[![Version](https://img.shields.io/npm/v/eslint-config-graphity.svg?style=flat-square)](https://www.npmjs.com/package/eslint-config-graphity)
[![License](https://img.shields.io/npm/l/eslint-config-graphity.svg?style=flat-square)](https://www.npmjs.com/package/eslint-config-graphity)

ESLint config based on [Javascript Popular Convention](http://sideeffect.kr/popularconvention#javascript).

## Installaion

```bash
npm install eslint-config-graphity -D
```

## Usage

Available Configs.

- `graphity/javascript` (default, alias `graphity`)
- `graphity/typescript`

`.eslintrc.js`

```js
module.exports = {
  extends: [
    'graphity',
    'graphity/typescript',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
```
