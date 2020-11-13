/* eslint-disable max-classes-per-file,@typescript-eslint/no-extraneous-class */
import { GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql'

import { Field } from '../decorators/field'
import { GraphityEntity } from '../decorators/graphity-entity'
import { GraphityResolver } from '../decorators/graphity-resolver'
import { Mutation } from '../decorators/mutation'
import { Query } from '../decorators/query'
import { MetadataStorage } from '../metadata/storage'
import { createGraphQLSchema } from './create-graphql-schema'
import { toGraphQLObject } from './to-graphql-object'


describe('@graphity/decorator, schema/create-graphql-schema', () => {

  beforeEach(() => {
    MetadataStorage.clearGlobalStorage()
  })

  it('test createGraphQLSchema, empty', () => {
    const schema = createGraphQLSchema({
      resolvers: [],
    })

    expect(schema).toEqualGraphQLSchema('')
  })

  it('test createGraphQLSchema, only query', () => {
    @GraphityEntity()
    class User {
      @Field(GraphQLNonNull(GraphQLID))
      id!: string
    }

    @GraphityResolver(() => User)
    class UserResolver {
      @Query()
      user() {
        //
      }
    }

    const schema = createGraphQLSchema({
      resolvers: [
        UserResolver,
      ],
    })

    expect(schema).toEqualGraphQLSchema(`
      type Query {
        user: User
      }

      type User {
        id: ID!
      }
    `)
  })

  it('test createGraphQLSchema, only mutation', () => {
    @GraphityEntity()
    class User {
      @Field(GraphQLNonNull(GraphQLID))
      id!: string
    }

    @GraphityResolver(() => User)
    class UserResolver {
      @Mutation()
      createUser() {
        //
      }
    }

    const schema = createGraphQLSchema({
      resolvers: [
        UserResolver,
      ],
    })

    expect(schema).toEqualGraphQLSchema(`
      type Mutation {
        createUser: User
      }

      type User {
        id: ID!
      }
    `)
  })
})
