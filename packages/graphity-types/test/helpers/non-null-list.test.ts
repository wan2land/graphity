import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql'

import { nonNullList } from '../../lib/helpers/non-null-list'

describe('testsuite of helpers/non-null-list', () => {
  it('test with scalar', () => {
    expect(nonNullList(GraphQLString).toString()).toBe('[String!]!')
    expect(nonNullList(GraphQLBoolean).toString()).toEqual('[Boolean!]!')
  })

  it('test with object', () => {
    expect(nonNullList(new GraphQLObjectType({
      name: 'User',
      fields: {},
    })).toString()).toEqual('[User!]!')
  })
})
