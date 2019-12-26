import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, printType } from 'graphql'

import { inputify } from './inputify'

function e(schema: string) {
  return schema.replace(/\s+/g, ' ')
}

describe('testsuite of helpers/inputify', () => {
  it('test simple', () => {
    const inputUser1 = inputify(new GraphQLObjectType({
      name: 'User',
      fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
      },
    }))
    expect(e(printType(inputUser1))).toBe(e(`input InputUser {
      id: ID!
      name: String!
    }`))

    const inputUser2 = inputify(new GraphQLObjectType({
      name: 'User',
      fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
      },
    }), {
      name: 'CustomInputName',
    })
    expect(e(printType(inputUser2))).toBe(e(`input CustomInputName {
      id: ID!
      name: String!
    }`))
  })

  it('test recursive', () => {
    const inputUser1 = inputify(new GraphQLObjectType({
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
    }))

    expect(e(printType(inputUser1))).toBe(e(`input InputUser {
      id: ID!
      name: String!
      company: InputCompany
    }`))
    expect(e(printType((inputUser1.getFields() as any).company.type))).toBe(e(`input InputCompany {
      id: ID!
      name: String
    }`))

    const inputUser2 = inputify(new GraphQLObjectType({
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
    }), { disableRecursive: true })

    expect(e(printType(inputUser2))).toBe(e(`input InputUser {
      id: ID!
      name: String!
    }`))
  })

  it('test except', () => {
    const inputUser1 = inputify(new GraphQLObjectType({
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
    }), {
      except: ['name'],
    })

    expect(e(printType(inputUser1))).toBe(e(`input InputUser {
      id: ID!
      company: InputCompany
    }`))
  })
})
