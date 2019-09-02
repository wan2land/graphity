import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, printType } from 'graphql'

import { GraphQLListOf } from '../../lib/types/graphql-list-of'


const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})

describe('testsuite of types/graphql-list-of', () => {
  it('test print type', () => {
    expect(printType(GraphQLListOf(GraphQLString))).toEqual(`type ListOfString {
  count: Int!
  nodes: [String!]!
}`)

    expect(printType(GraphQLListOf(GraphQLString, 'StringList'))).toEqual(`type StringList {
  count: Int!
  nodes: [String!]!
}`)

    expect(printType(GraphQLListOf(GraphQLUser))).toEqual(`type ListOfUser {
  count: Int!
  nodes: [User!]!
}`)

    expect(printType(GraphQLListOf(GraphQLUser, 'UserList'))).toEqual(`type UserList {
  count: Int!
  nodes: [User!]!
}`)
  })
})
