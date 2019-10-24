import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, printType } from 'graphql'

import { inputfy } from './inputfy'

describe('testsuite of helpers/inputfy', () => {
  it('test simple', () => {
    expect(printType(inputfy(new GraphQLObjectType({
      name: 'User',
      fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
      },
    })))).toBe(`input InputUser {
  id: ID!
  name: String!
}`)
  })

  it('test recursive', () => {
    expect(printType(inputfy(new GraphQLObjectType({
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
    })))).toBe(`input InputUser {
  id: ID!
  name: String!
  company: InputCompany
}`)

    expect(printType(inputfy(new GraphQLObjectType({
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
    }), { disableRecursive: true }))).toBe(`input InputUser {
  id: ID!
  name: String!
}`)
  })
})
