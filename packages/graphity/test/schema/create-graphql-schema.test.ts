import { execute, parse, printSchema } from 'graphql'

import { createSchema } from '../../lib/schema/create-schema'
import { ArticleResolver } from '../stubs/resolvers/article-resolver'
import { HomeResolver } from '../stubs/resolvers/home-resolver'
import { UserResolver } from '../stubs/resolvers/user-resolver'


describe('testsuite of schema/create-graphql-schema', () => {
  it('test default schema', async () => {
    const schema = createSchema({})
    expect(printSchema(schema)).toEqual(`type Query
`)
  })

  it('test simple resolver', async () => {
    const schema = createSchema({
      resolvers: [
        ArticleResolver,
        HomeResolver,
      ],
    })
    // schema.
    expect(printSchema(schema)).toEqual(`"""article entity"""
type Article {
  """article id"""
  id: ID!
  title: String!
  contents: String
}

type ListOfArticle {
  count: Int!
  nodes: [Article!]!
}

type Mutation {
  """this is createArticle"""
  createArticle(title: String!): Article
  updateArticle(id: ID!, title: String): Article
  deleteArticle(id: ID!): Article
}

type Query {
  """this is article"""
  article(id: ID!): Article
  articles(take: Int, after: String, offset: Int): ListOfArticle
  version: String
}
`)

    expect(await execute({
      schema,
      document: parse(`query {
        article(id: "1") {
          id
          title
        }
        articles {
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
          title: 'this is 1',
        },
        articles: {
          count: 1,
          nodes: [
            {
              id: '1',
              title: 'this is 1',
            },
          ],
        },
      },
    })
  })

  it('test recursive resolver', async () => {
    const schema = await createSchema({
      resolvers: [
        UserResolver,
      ],
    })
    expect(printSchema(schema)).toEqual(`type ListOfUser {
  count: Int!
  nodes: [User!]!
}

type Query {
  user(id: ID!): User
}

type User {
  id: ID!
  name: String!
  users: ListOfUser!
}
`)

    expect(await execute({
      schema,
      document: parse(`query {
        user(id: "1") {
          id
          name
          users {
            count
            nodes {
              id
              name
              users {
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
    })).toEqual({
      data: {
        user: {
          id: '1',
          name: 'name is 1',
          users: {
            count: 2,
            nodes: [
              {
                id: '1_1',
                name: 'name is 1_1',
                users: {
                  count: 2,
                  nodes: [
                    {
                      id: '1_1_1',
                      name: 'name is 1_1_1',
                    },
                    {
                      id: '1_1_2',
                      name: 'name is 1_1_2',
                    },
                  ],
                },
              },
              {
                id: '1_2',
                name: 'name is 1_2',
                users: {
                  count: 2,
                  nodes: [
                    {
                      id: '1_2_1',
                      name: 'name is 1_2_1',
                    },
                    {
                      id: '1_2_2',
                      name: 'name is 1_2_2',
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

  it('test root guards', async () => {
    const schema = createSchema({
      rootGuards: [
        async (parent, args, ctx, info, next) => {
          ctx.stack = ctx.stack || []
          ctx.stack.push('before root')
          const result = await next(parent, args, ctx, info)
          ctx.stack.push(`after root (${JSON.stringify(result)})`)
          return result
        },
      ],
      resolvers: [
        UserResolver,
      ],
    })

    const ctx = { $: true }
    await execute({
      schema,
      document: parse(`query {
        user(id: "1") {
          id
          users {
            nodes {
              id
              users {
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
      contextValue: ctx,
    })

    const user1 = JSON.stringify({ id: '1', name: 'name is 1' })
    const user1users = JSON.stringify({ count: 2,
      nodes: [
        { id: '1_1', name: 'name is 1_1' },
        { id: '1_2', name: 'name is 1_2' },
      ] })
    const user11users = JSON.stringify({ count: 2,
      nodes: [
        { id: '1_1_1', name: 'name is 1_1_1' },
        { id: '1_1_2', name: 'name is 1_1_2' },
      ] })
    const user12users = JSON.stringify({ count: 2,
      nodes: [
        { id: '1_2_1', name: 'name is 1_2_1' },
        { id: '1_2_2', name: 'name is 1_2_2' },
      ] })

    expect(ctx).toEqual({
      $: true,
      stack: [
        'before root',
        'before user resolver1',
        'before user resolver2',
        'before user resolver - user',
        `after user resolver - user (${user1})`,
        `after user resolver2 (${user1})`,
        `after user resolver1 (${user1})`,
        `after root (${user1})`,

        'before user field - id',
        'after user field - id ("1")',

        'before user resolver1',
        'before user resolver2',
        'before user resolver - users1',
        'before user resolver - users2',

        `after user resolver - users2 (${user1users})`,
        `after user resolver - users1 (${user1users})`,
        `after user resolver2 (${user1users})`,
        `after user resolver1 (${user1users})`,

        'before user field - id',
        'after user field - id ("1_1")',

        'before user resolver1',
        'before user resolver2',
        'before user resolver - users1',
        'before user resolver - users2',

        'before user field - id',
        'after user field - id ("1_2")',

        'before user resolver1',
        'before user resolver2',
        'before user resolver - users1',
        'before user resolver - users2',

        `after user resolver - users2 (${user11users})`,
        `after user resolver - users2 (${user12users})`,
        `after user resolver - users1 (${user11users})`,
        `after user resolver - users1 (${user12users})`,
        `after user resolver2 (${user11users})`,
        `after user resolver2 (${user12users})`,
        `after user resolver1 (${user11users})`,
        `after user resolver1 (${user12users})`,

        'before user field - id',
        'after user field - id ("1_1_1")',
        'before user field - name1',
        'before user field - name2',
        'after user field - name2 ("name is 1_1_1")',
        'after user field - name1 ("name is 1_1_1")',

        'before user field - id',
        'after user field - id ("1_1_2")',
        'before user field - name1',
        'before user field - name2',
        'after user field - name2 ("name is 1_1_2")',
        'after user field - name1 ("name is 1_1_2")',

        'before user field - id',
        'after user field - id ("1_2_1")',

        'before user field - name1',
        'before user field - name2',
        'after user field - name2 ("name is 1_2_1")',
        'after user field - name1 ("name is 1_2_1")',

        'before user field - id',
        'after user field - id ("1_2_2")',

        'before user field - name1',
        'before user field - name2',
        'after user field - name2 ("name is 1_2_2")',
        'after user field - name1 ("name is 1_2_2")',
      ],
    })
  })
})
