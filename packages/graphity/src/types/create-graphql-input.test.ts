import { GraphQLID, GraphQLNonNull, GraphQLString, printType } from 'graphql'

import { createGraphQLInput } from './create-graphql-input'

describe('testsuite of types/create-graphql-input', () => {
  it('test simple', () => {
    const input = createGraphQLInput({
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
    expect(printType(input)).toEqual(`input CreateUser {
  id: ID!
  name: String
  email: String
  address: CreateUserAddress
}`)
    expect(printType(input.getFields().address.type as any)).toEqual(`input CreateUserAddress {
  address1: String!
  address2: String
  zipcode: String
}`)
  })
})
