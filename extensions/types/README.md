# Graphity Extensions - Types

<a href="https://npmcharts.com/compare/@graphity-extensions/types?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/@graphity-extensions/types.svg?style=flat-square" /></a>
<a href="https://www.npmjs.com/package/@graphity-extensions/types"><img alt="Version" src="https://img.shields.io/npm/v/@graphity-extensions/types.svg?style=flat-square" /></a>
<img alt="License" src="https://img.shields.io/npm/l/@graphity-extensions/types.svg?style=flat-square" />
<img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
<br />
<a href="https://david-dm.org/wan2land/@graphity-extensions/types"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/@graphity-extensions/types.svg?style=flat-square" /></a>
<a href="https://david-dm.org/wan2land/@graphity-extensions/types?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/@graphity-extensions/types.svg?style=flat-square" /></a>

## Installation

```bash
npm install @graphity-extensions/types --save
```

## Usage

### Helpers

- inputify (`type Name { ... }` => `input InputName { ... }` except interface, union)
- GraphQLList (`String` => `type ListOfString { count: Int!, nodes: [String!]! }`)
- GraphQLNonNullList (`String` => `[String!]!`)
- GraphQLInput

#### GraphQLInput

```js
const inputType = GraphQLInput({
  name: 'CreateUser',
  fields: {
    id: GraphQLNonNull(GraphQLID),
    name: GraphQLString,
    email: GraphQLString,
    address: {
      address1: GraphQLNonNull(GraphQLString),
      address2: GraphQLString,
      zipcode: GraphQLString,
    },
  },
})
```

to

```graphql
input CreateUser {
  id: ID!
  name: String
  email: String
  address: CreateUserAddress
}

input CreateUserAddress {
  address1: String!
  address2: String
  zipcode: String
}
```

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
