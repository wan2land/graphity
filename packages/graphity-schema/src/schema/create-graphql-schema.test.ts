/* eslint-disable max-classes-per-file,@typescript-eslint/no-extraneous-class */
import { GraphQLNonNull, GraphQLID, GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString, GraphQLInputObjectType, execute, parse } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { Field } from '../decorators/field'
import { GraphityEntity } from '../decorators/graphity-entity'
import { GraphityResolver } from '../decorators/graphity-resolver'
import { Mutation } from '../decorators/mutation'
import { Query } from '../decorators/query'
import { Middleware, MiddlewareCarry, MiddlewareClass, MiddlewareNext } from '../interfaces/middleware'
import { createGraphQLSchema } from './create-graphql-schema'


describe('@graphity/schema, schema/create-graphql-schema', () => {

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
        await new Promise(resolve => setTimeout(resolve, 50))
        return Object.assign(new Article(), {
          id: `${input.id}`,
          title: `${this.prefix}${input.id}${this.suffix}`,
        })
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
        const take = params.take || 20
        const offset = params.offset || 0
        await new Promise(resolve => setTimeout(resolve, 50))
        return {
          count: 9999,
          nodes: [...new Array(take).keys()].map(i => {
            return Object.assign(new Article(), {
              id: offset + i,
              title: `article (id=${offset + i})`,
            })
          }),
        }
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
        await new Promise(resolve => setTimeout(resolve, 50))
        return Object.assign(new Article(), {
          id: '2',
          title: input.title,
        })
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
        await new Promise(resolve => setTimeout(resolve, 50))
        return Object.assign(new Article(), {
          id: input.id,
          title: typeof input.title === 'undefined' ? `this is ${input.id} article` : input.title,
        })
      }

      @Mutation({
        input: {
          id: {
            type: GraphQLNonNull(GraphQLID),
          },
        },
      })
      async deleteArticle(_: null, input: {id: string}) {
        await new Promise(resolve => setTimeout(resolve, 50))
        return Object.assign(new Article(), {
          id: input.id,
          title: `${this.prefix}${input.id}${this.suffix}`,
        })
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
        return Object.assign(new User(), {
          id: `${input.id}`,
          name: `user${input.id} of article${parent.id}`,
        })
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
        return {
          count: 2,
          nodes: [
            Object.assign(new User(), {
              id: `${parent.id}.1`,
              name: `friend1 of ${parent.name}`,
            }),
            Object.assign(new User(), {
              id: `${parent.id}.2`,
              name: `friend2 of ${parent.name}`,
            }),
          ],
        }
      }
    }


    await GraphQLContainer.getGlobalContainer().boot()

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

    expect(await execute({
      schema,
      document: parse(`query {
        article(id: "1") {
          id
          title
        }
        articles(take: 2, offset: 10) {
          count
          nodes {
            id
            title
          }
        }
      }`),
    })).toEqual({
      data: {
        article: {
          id: '1',
          title: 'article (id=1)',
        },
        articles: {
          count: 9999,
          nodes: [
            {
              id: '10',
              title: 'article (id=10)',
            },
            {
              id: '11',
              title: 'article (id=11)',
            },
          ],
        },
      },
    })

    const response = await execute({
      schema,
      document: parse(`query {
        user(id: "1") {
          id
          name
          friends {
            count
            nodes {
              id
              name
              friends {
                count
                nodes {
                  id
                  name
                }
              }
            }
          }
        }
      }`),
      contextValue: {},
    })

    expect(response).toEqual({
      data: {
        user: {
          id: '1',
          name: 'user1',
          friends: {
            count: 2,
            nodes: [
              {
                id: '1.1',
                name: 'friend1 of user1',
                friends: {
                  count: 2,
                  nodes: [
                    {
                      id: '1.1.1',
                      name: 'friend1 of friend1 of user1',
                    },
                    {
                      id: '1.1.2',
                      name: 'friend2 of friend1 of user1',
                    },
                  ],
                },
              },
              {
                id: '1.2',
                name: 'friend2 of user1',
                friends: {
                  count: 2,
                  nodes: [
                    {
                      id: '1.2.1',
                      name: 'friend1 of friend2 of user1',
                    },
                    {
                      id: '1.2.2',
                      name: 'friend2 of friend2 of user1',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    })
  })

  it('test createSchema middlewares', async () => {
    function createDetector(name: string): MiddlewareClass {
      return class {
        async handle({ parent, args, context, info }: MiddlewareCarry<any, any>, next: MiddlewareNext<any, any>) {
          await new Promise((resolve) => setTimeout(resolve, 50)) // async
          context.stack.push(`start :: ${name} (parent=${JSON.stringify(parent || null)})`)
          const result = await next({ parent, args, context, info })
          context.stack.push(`end :: ${name} (parent=${JSON.stringify(parent || null)}, next=${JSON.stringify(result)})`)
          return result
        }
      }
    }

    class Nothing implements Middleware {
      handle(_: any, next: any) {
        return next()
      }
    }

    @GraphityEntity()
    class Comment {
      @Field(type => GraphQLNonNull(GraphQLID), {
        middlewares: [
          Nothing,
          createDetector('field / user.id ... 1'),
          Nothing,
          createDetector('field / user.id ... 2'),
          Nothing,
        ],
      })
      id!: string
    }

    @GraphityResolver(returns => Comment, {
      middlewares: [
        Nothing,
        createDetector('resolver ... 1'),
        Nothing,
        createDetector('resolver ... 2'),
        Nothing,
      ],
    })
    class CommentResolver {
      @Query({
        input: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        middlewares: createDetector('resolver / comment'),
      })
      comment(_: null, input: {id: string}) {
        return Object.assign(new Comment(), {
          id: `${input.id}`,
        })
      }

      @Query({
        parent: type => Comment,
        middlewares: [
          Nothing,
          createDetector('resolver / comments ... 1'),
          Nothing,
          createDetector('resolver / comments ... 2'),
          Nothing,
        ],
        returns: node => GraphQLNonNull(new GraphQLObjectType({
          name: 'ListOfComments',
          fields: {
            count: { type: GraphQLNonNull(GraphQLInt) },
            nodes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(node))) },
          },
        })),
      })
      comments(parent: Comment) {
        return {
          count: 2,
          nodes: [
            Object.assign(new Comment(), {
              id: `${parent.id}.1`,
            }),
            Object.assign(new Comment(), {
              id: `${parent.id}.2`,
            }),
          ],
        }
      }
    }

    const globalMiddlewares = [
      Nothing,
      createDetector('common'),
      Nothing,
    ]
    const queryMiddlewares = [
      Nothing,
      createDetector('common query'),
      Nothing,
    ]
    const mutationMiddlewares = [
      Nothing,
      createDetector('common mutation'),
      Nothing,
    ]

    globalMiddlewares.forEach(middleware => GraphQLContainer.getGlobalContainer().bind(middleware))
    queryMiddlewares.forEach(middleware => GraphQLContainer.getGlobalContainer().bind(middleware))
    mutationMiddlewares.forEach(middleware => GraphQLContainer.getGlobalContainer().bind(middleware))

    await GraphQLContainer.getGlobalContainer().boot()

    const schema = createGraphQLSchema({
      globalMiddlewares,
      queryMiddlewares,
      mutationMiddlewares,
      resolvers: [
        CommentResolver,
      ],
    })

    const ctx: { $: true, stack: string[] } = { $: true, stack: [] }
    const response = await execute({
      schema,
      document: parse(`query {
        comment(id: "1") {
          id
          comments {
            nodes {
              id
              comments {
                count
                nodes {
                  id
                }
              }
            }
          }
        }
      }`),
      contextValue: ctx,
    })

    expect(response).toEqual({
      data: {
        comment: {
          id: '1',
          comments: {
            nodes: [
              {
                comments: {
                  count: 2,
                  nodes: [
                    {
                      id: '1.1.1',
                    },
                    {
                      id: '1.1.2',
                    },
                  ],
                },
                id: '1.1',
              },
              {
                comments: {
                  count: 2,
                  nodes: [
                    {
                      id: '1.2.1',
                    },
                    {
                      id: '1.2.2',
                    },
                  ],
                },
                id: '1.2',
              },
            ],
          },
        },
      },
    })

    expect(ctx.$).toBe(true)
    expect(ctx.stack.length).toEqual(74)
    expect([...new Set(ctx.stack)].length).toEqual(74)

    const serials = [
      [
        'start :: common (parent=null)',
        'start :: common query (parent=null)',
        'start :: resolver ... 1 (parent=null)',
        'start :: resolver ... 2 (parent=null)',
        'start :: resolver / comment (parent=null)',
        'end :: resolver / comment (parent=null, next={"id":"1"})',
        'end :: resolver ... 2 (parent=null, next={"id":"1"})',
        'end :: resolver ... 1 (parent=null, next={"id":"1"})',
        'end :: common query (parent=null, next={"id":"1"})',
        'end :: common (parent=null, next={"id":"1"})',
      ],
      [
        'start :: field / user.id ... 1 (parent={"id":"1"})',
        'start :: field / user.id ... 2 (parent={"id":"1"})',
        'end :: field / user.id ... 2 (parent={"id":"1"}, next="1")',
        'end :: field / user.id ... 1 (parent={"id":"1"}, next="1")',
      ],
      [
        'start :: common (parent={"id":"1"})',
        'start :: common query (parent={"id":"1"})',
        'start :: resolver ... 1 (parent={"id":"1"})',
        'start :: resolver ... 2 (parent={"id":"1"})',
        'start :: resolver / comments ... 1 (parent={"id":"1"})',
        'start :: resolver / comments ... 2 (parent={"id":"1"})',
        'end :: resolver / comments ... 2 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: resolver / comments ... 1 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: resolver ... 2 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: resolver ... 1 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: common query (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: common (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
      ],
      [
        'start :: field / user.id ... 1 (parent={"id":"1.1"})',
        'start :: field / user.id ... 2 (parent={"id":"1.1"})',
        'end :: field / user.id ... 2 (parent={"id":"1.1"}, next="1.1")',
        'end :: field / user.id ... 1 (parent={"id":"1.1"}, next="1.1")',
      ],
      [
        'start :: common (parent={"id":"1.1"})',
        'start :: common query (parent={"id":"1.1"})',
        'start :: resolver ... 1 (parent={"id":"1.1"})',
        'start :: resolver ... 2 (parent={"id":"1.1"})',
        'start :: resolver / comments ... 1 (parent={"id":"1.1"})',
        'start :: resolver / comments ... 2 (parent={"id":"1.1"})',
        'end :: resolver / comments ... 2 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: resolver / comments ... 1 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: resolver ... 2 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: resolver ... 1 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: common query (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: common (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
      ],
      [
        'start :: field / user.id ... 1 (parent={"id":"1.2"})',
        'start :: field / user.id ... 2 (parent={"id":"1.2"})',
        'end :: field / user.id ... 2 (parent={"id":"1.2"}, next="1.2")',
        'end :: field / user.id ... 1 (parent={"id":"1.2"}, next="1.2")',
      ],
      [
        'start :: common (parent={"id":"1.2"})',
        'start :: common query (parent={"id":"1.2"})',
        'start :: resolver ... 1 (parent={"id":"1.2"})',
        'start :: resolver ... 2 (parent={"id":"1.2"})',
        'start :: resolver / comments ... 1 (parent={"id":"1.2"})',
        'start :: resolver / comments ... 2 (parent={"id":"1.2"})',
        'end :: resolver / comments ... 2 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: resolver / comments ... 1 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: resolver ... 2 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: resolver ... 1 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: common query (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: common (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
      ],
      [
        'start :: field / user.id ... 1 (parent={"id":"1.1.1"})',
        'start :: field / user.id ... 2 (parent={"id":"1.1.1"})',
        'end :: field / user.id ... 2 (parent={"id":"1.1.1"}, next="1.1.1")',
        'end :: field / user.id ... 1 (parent={"id":"1.1.1"}, next="1.1.1")',
      ],
      [
        'start :: field / user.id ... 1 (parent={"id":"1.1.2"})',
        'start :: field / user.id ... 2 (parent={"id":"1.1.2"})',
        'end :: field / user.id ... 2 (parent={"id":"1.1.2"}, next="1.1.2")',
        'end :: field / user.id ... 1 (parent={"id":"1.1.2"}, next="1.1.2")',
      ],
      [
        'start :: field / user.id ... 1 (parent={"id":"1.2.1"})',
        'start :: field / user.id ... 2 (parent={"id":"1.2.1"})',
        'end :: field / user.id ... 2 (parent={"id":"1.2.1"}, next="1.2.1")',
        'end :: field / user.id ... 1 (parent={"id":"1.2.1"}, next="1.2.1")',
      ],
      [
        'start :: field / user.id ... 1 (parent={"id":"1.2.2"})',
        'start :: field / user.id ... 2 (parent={"id":"1.2.2"})',
        'end :: field / user.id ... 2 (parent={"id":"1.2.2"}, next="1.2.2")',
        'end :: field / user.id ... 1 (parent={"id":"1.2.2"}, next="1.2.2")',
      ],
    ]

    let counter = 0
    for (const serial of serials) {
      let index = -1
      for (const line of serial) {
        const foundIndex = ctx.stack.indexOf(line)
        expect(foundIndex).toBeGreaterThanOrEqual(0)
        expect(foundIndex).toBeGreaterThanOrEqual(index)
        index = foundIndex
        counter++
      }
    }
    expect(counter).toEqual(74)
  })
})
