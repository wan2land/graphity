import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, printType } from 'graphql'

import { inputify } from './inputify'

describe('testsuite of helpers/inputify', () => {
  it('test simple', () => {
    expect(printType(inputify(new GraphQLObjectType({
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
    expect(printType(inputify(new GraphQLObjectType({
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

    expect(printType(inputify(new GraphQLObjectType({
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
