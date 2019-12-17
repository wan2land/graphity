import { GraphQLID, GraphQLNonNull, GraphQLString, printType } from 'graphql'

import { createGraphQLObject } from './create-graphql-object'

describe('testsuite of types/create-graphql-object', () => {
  it('test simple', () => {
    const object = createGraphQLObject({
      name: 'User',
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
    expect(printType(object)).toEqual(`type User {
  id: ID!
  name: String
  email: String
  address: UserAddress
}`)
    expect(printType(object.getFields().address.type as any)).toEqual(`type UserAddress {
  address1: String!
  address2: String
  zipcode: String
}`)
  })
})
