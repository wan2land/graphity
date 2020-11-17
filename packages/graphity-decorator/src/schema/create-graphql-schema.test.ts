/* eslint-disable max-classes-per-file,@typescript-eslint/no-extraneous-class */
import { GraphQLNonNull, GraphQLID } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { Field } from '../decorators/field'
import { GraphityEntity } from '../decorators/graphity-entity'
import { GraphityResolver } from '../decorators/graphity-resolver'
import { Mutation } from '../decorators/mutation'
import { Query } from '../decorators/query'
import { createGraphQLSchema } from './create-graphql-schema'


describe('@graphity/decorator, schema/create-graphql-schema', () => {

  beforeEach(() => {
    GraphQLContainer.clearGlobalContainer()
  })

  it('test createGraphQLSchema, empty', async () => {
    const schema = createGraphQLSchema({
      resolvers: [],
    })

    await GraphQLContainer.getGlobalContainer().boot()

    expect(schema).toEqualGraphQLSchema('')
  })

  it('test createGraphQLSchema, only query', async () => {
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

    await GraphQLContainer.getGlobalContainer().boot()

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

  it('test createGraphQLSchema, only mutation', async () => {
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


    await GraphQLContainer.getGlobalContainer().boot()

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
