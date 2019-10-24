# Graphity Extensions - Types

[![Downloads](https://img.shields.io/npm/dt/@graphity-extensions/types.svg)](https://npmcharts.com/compare/@graphity-extensions/types?minimal=true)
[![Version](https://img.shields.io/npm/v/@graphity-extensions/types.svg)](https://www.npmjs.com/package/@graphity-extensions/types)
[![License](https://img.shields.io/npm/l/@graphity-extensions/types.svg)](https://www.npmjs.com/package/@graphity-extensions/types)
![Typescript](https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square)

## How to use

### Installation

```bash
npm install @graphity-extensions/types --save
```

### Usage Helpers

- inputify (`type Name { ... }` => `input InputName { ... }` except interface, union)
- listOf (`String` => `type ListOfString { count: Int!, nodes: [String!]! }`)
- nonNullList (`String` => `[String!]!`)

### Usage Types

- GraphQLInputPagination (`input InputPagination { take: Int, offset: Int }`)

### Usage Scalars

- GraphQLDateTime (from `graphiql-scalars`)
- GraphQLEmailAddress (from `graphiql-scalars`)
- GraphQLNegativeFloat (from `graphiql-scalars`)
- GraphQLNegativeInt (from `graphiql-scalars`)
- GraphQLNonNegativeFloat (from `graphiql-scalars`)
- GraphQLNonNegativeInt (from `graphiql-scalars`)
- GraphQLNonPositiveFloat (from `graphiql-scalars`)
- GraphQLNonPositiveInt (from `graphiql-scalars`)
- GraphQLPhoneNumber (from `graphiql-scalars`)
- GraphQLPositiveFloat (from `graphiql-scalars`)
- GraphQLPositiveInt (from `graphiql-scalars`)
- GraphQLPostalCode (from `graphiql-scalars`)
- GraphQLUnsignedFloat (from `graphiql-scalars`)
- GraphQLUnsignedInt (from `graphiql-scalars`)
- GraphQLURL (from `graphiql-scalars`)
- GraphQLBigInt (from `graphiql-scalars`)
- GraphQLLong (from `graphiql-scalars`)
- GraphQLGUID (from `graphiql-scalars`)
- GraphQLHexColorCode (from `graphiql-scalars`)
- GraphQLHSL (from `graphiql-scalars`)
- GraphQLHSLA (from `graphiql-scalars`)
- GraphQLIPv4 (from `graphiql-scalars`)
- GraphQLIPv6 (from `graphiql-scalars`)
- GraphQLISBN (from `graphiql-scalars`)
- GraphQLMAC (from `graphiql-scalars`)
- GraphQLPort (from `graphiql-scalars`)
- GraphQLRGB (from `graphiql-scalars`)
- GraphQLRGBA (from `graphiql-scalars`)
- GraphQLUSCurrency (from `graphiql-scalars`)
- GraphQLJSON (from `graphiql-scalars`)
- GraphQLJSONObject (from `graphiql-scalars`)
