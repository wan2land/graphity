# Graphity - Types

<a href="https://npmcharts.com/compare/@graphity/types?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/@graphity/types.svg?style=flat-square" /></a>
<a href="https://www.npmjs.com/package/@graphity/types"><img alt="Version" src="https://img.shields.io/npm/v/@graphity/types.svg?style=flat-square" /></a>
<img alt="License" src="https://img.shields.io/npm/l/@graphity/types.svg?style=flat-square" />
<img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
<br />
<a href="https://david-dm.org/wan2land/graphity?path=packages/graphity-types"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/graphity.svg?style=flat-square&path=packages/graphity-types" /></a>

## Installation

```bash
npm install @graphity/types --save
```

## inputify

```typescript
import { inputify } from '@graphity/types'

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    company: { type: new GraphQLObjectType({
      name: 'Company',
      fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
      },
    }) },
  },
})

const InputGraphQLUser = inputify(GraphQLUser)

/*
input InputCompany {
  id: ID!
  name: String
}

input InputUser {
  id: ID!
  name: String!
  company: InputCompany
}
*/

const InputGraphQLUser = inputify(GraphQLUser, { disableRecursive: true })
/*
input InputUser {
  id: ID!
  name: String!
}
*/
```
