import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql'

import { GraphQLNonNullList } from './graphql-non-null-list'

describe('testsuite of helpers/graphql-non-null-list', () => {
  it('test with scalar', () => {
    expect(GraphQLNonNullList(GraphQLString).toString()).toBe('[String!]!')
    expect(GraphQLNonNullList(GraphQLBoolean).toString()).toEqual('[Boolean!]!')
  })

  it('test with object', () => {
    expect(GraphQLNonNullList(new GraphQLObjectType({
      name: 'User',
      fields: {},
    })).toString()).toEqual('[User!]!')
  })
})
