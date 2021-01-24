/* eslint-disable max-classes-per-file,@typescript-eslint/no-extraneous-class */
import { GraphQLNonNull, GraphQLID, GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString, GraphQLInputObjectType } from 'graphql'

import { Field } from '../decorators/field'
import { GraphityEntity } from '../decorators/graphity-entity'
import { GraphityResolver } from '../decorators/graphity-resolver'
import { Mutation } from '../decorators/mutation'
import { Query } from '../decorators/query'
import { MetadataStorage } from '../metadata/MetadataStorage'
import { createGraphQLSchema } from './createGraphQLSchema'


describe('@graphity/schema, schema/createGraphQLSchema', () => {

  beforeEach(() => {
    MetadataStorage.clearGlobalStorage()
  })

  it('test createGraphQLSchema, empty', async () => {
    const schema = createGraphQLSchema({
      resolvers: [],
    })

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

  it('test createGraphQLSchema, all', async () => {
    @GraphityEntity({
      description: 'article entity',
    })
    class Article {
      @Field(type => GraphQLNonNull(GraphQLID), {
        description: 'article id',
      })
      id!: string

      @Field(type => GraphQLNonNull(GraphQLString))
      title!: string

      @Field(type => GraphQLString)
      contents?: string | null
    }

    @GraphityEntity()
    class User {
      @Field(type => GraphQLNonNull(GraphQLID))
      id!: string

      @Field(type => GraphQLNonNull(GraphQLString))
      name!: string
    }


    @GraphityResolver(returns => Article)
    class ArticleResolver {

      prefix = 'article (id='
      suffix = ')'

      @Query({
        input: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        description: 'this is article',
      })
      async article(_: null, input: {id: string}) {
        //
      }

      @Query({
        returns: node => new GraphQLObjectType({
          name: 'ListOfArticles',
          fields: {
            count: { type: GraphQLNonNull(GraphQLInt) },
            nodes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(node))) },
          },
        }),
        input: {
          take: { type: GraphQLInt },
          offset: { type: GraphQLInt },
        },
      })
      async articles(_: null, params: { take?: number, offset?: number }) {
        //
      }

      @Mutation({
        input: {
          input: { type: GraphQLNonNull(new GraphQLInputObjectType({
            name: 'InputCreateArticle',
            fields: {
              title: { type: GraphQLString },
            },
          })) },
        },
        description: 'this is createArticle',
      })
      async createArticle(_: null, input: {title: string}) {
        //
      }

      @Mutation({
        input: {
          id: { type: GraphQLNonNull(GraphQLID) },
          input: { type: GraphQLNonNull(new GraphQLInputObjectType({
            name: 'InputUpdateArticle',
            fields: {
              title: { type: GraphQLString },
            },
          })) },
        },
      })
      async updateArticle(_: null, input: {id: string, title?: string | null}) {
        //
      }

      @Mutation({
        input: {
          id: {
            type: GraphQLNonNull(GraphQLID),
          },
        },
      })
      async deleteArticle(_: null, input: {id: string}) {
        //
      }
    }

    @GraphityResolver(returns => User)
    class UserResolver {

      @Query({
        input: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
      })
      user(parent: null, input: {id: string}) {
        return Object.assign(new User(), {
          id: `${input.id}`,
          name: `user${input.id}`,
        })
      }

      @Query({
        parent: () => Article,
        name: 'user',
      })
      userFromArticle(parent: Article, input: {id: string}) {
        //
      }

      @Query({
        parent: type => User,
        returns: node => GraphQLNonNull(new GraphQLObjectType({
          name: 'ListOfFriends',
          fields: {
            count: { type: GraphQLNonNull(GraphQLInt) },
            nodes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(node))) },
          },
        })),
      })
      friends(parent: User) {
        //
      }
    }


    const schema = createGraphQLSchema({
      resolvers: [
        ArticleResolver,
        UserResolver,
      ],
    })

    // schema.
    expect(schema).toEqualGraphQLSchema(`
      """article entity"""
      type Article {
        contents: String

        """article id"""
        id: ID!
        title: String!
        user: User
      }

      input InputCreateArticle {
        title: String
      }

      input InputUpdateArticle {
        title: String
      }

      type ListOfArticles {
        count: Int!
        nodes: [Article!]!
      }

      type ListOfFriends {
        count: Int!
        nodes: [User!]!
      }

      type Mutation {
        """this is createArticle"""
        createArticle(input: InputCreateArticle!): Article
        deleteArticle(id: ID!): Article
        updateArticle(id: ID!, input: InputUpdateArticle!): Article
      }

      type Query {
        """this is article"""
        article(id: ID!): Article
        articles(offset: Int, take: Int): ListOfArticles
        user(id: ID!): User
      }

      type User {
        friends: ListOfFriends!
        id: ID!
        name: String!
      }
    `)
  })
})
