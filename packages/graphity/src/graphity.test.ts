import { execute, parse, printSchema } from 'graphql'

import { Graphity } from './graphity'
import { createDetector } from '../stubs/middlewares/create-detector'
import { Nothing } from '../stubs/middlewares/nothing'
import { ArticleResolver } from '../stubs/resolvers/article-resolver'
import { CommentResolver } from '../stubs/resolvers/comment-resolver'
import { HomeResolver } from '../stubs/resolvers/home-resolver'
import { UserResolver } from '../stubs/resolvers/user-resolver'


describe('testsuite of graphity', () => {
  it('test createSchema empty', async () => {
    const graphity = new Graphity()
    await graphity.boot()

    expect(printSchema(graphity.createSchema())).toEqual(`type Query
`)
  })

  it('test createSchema simple', async () => {
    const graphity = new Graphity({
      resolvers: [
        ArticleResolver,
        UserResolver,
        HomeResolver,
      ],
    })
    await graphity.boot()

    const schema = graphity.createSchema()

    // schema.
    expect(printSchema(schema)).toEqual(`"""article entity"""
type Article {
  """article id"""
  id: ID!
  title: String!
  contents: String
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
  updateArticle(id: ID!, input: InputUpdateArticle!): Article
  deleteArticle(id: ID!): Article
}

type Query {
  """this is article"""
  article(id: ID!): Article
  articles(take: Int, offset: Int): ListOfArticles
  user(id: ID!): User
  version: String
}

type User {
  id: ID!
  name: String!
  friends: ListOfFriends!
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
          title: 'this is 1 article',
        },
        articles: {
          count: 9999,
          nodes: [
            {
              id: '10',
              title: 'this is 10 article',
            },
            {
              id: '11',
              title: 'this is 11 article',
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
    const graphity = new Graphity({
      resolvers: [
        CommentResolver,
      ],
      commonMiddlewares: [
        Nothing,
        createDetector('common'),
        Nothing,
      ],
      commonQueryMiddlewares: [
        Nothing,
        createDetector('common query'),
        Nothing,
      ],
      commonMutationMiddlewares: [
        Nothing,
        createDetector('common mutation'),
        Nothing,
      ],
    })
    await graphity.boot()

    const schema = graphity.createSchema()

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
    expect(ctx.stack.length).toEqual(62)
    expect([...new Set(ctx.stack)].length).toEqual(62)

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
        'start :: entity / user.id ... 1 (parent={"id":"1"})',
        'start :: entity / user.id ... 2 (parent={"id":"1"})',
        'end :: entity / user.id ... 2 (parent={"id":"1"}, next="1")',
        'end :: entity / user.id ... 1 (parent={"id":"1"}, next="1")',
      ],
      [
        'start :: resolver ... 1 (parent={"id":"1"})',
        'start :: resolver ... 2 (parent={"id":"1"})',
        'start :: resolver / comments ... 1 (parent={"id":"1"})',
        'start :: resolver / comments ... 2 (parent={"id":"1"})',
        'end :: resolver / comments ... 2 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: resolver / comments ... 1 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: resolver ... 2 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
        'end :: resolver ... 1 (parent={"id":"1"}, next={"count":2,"nodes":[{"id":"1.1"},{"id":"1.2"}]})',
      ],
      [
        'start :: entity / user.id ... 1 (parent={"id":"1.1"})',
        'start :: entity / user.id ... 2 (parent={"id":"1.1"})',
        'end :: entity / user.id ... 2 (parent={"id":"1.1"}, next="1.1")',
        'end :: entity / user.id ... 1 (parent={"id":"1.1"}, next="1.1")',
      ],
      [
        'start :: resolver ... 1 (parent={"id":"1.1"})',
        'start :: resolver ... 2 (parent={"id":"1.1"})',
        'start :: resolver / comments ... 1 (parent={"id":"1.1"})',
        'start :: resolver / comments ... 2 (parent={"id":"1.1"})',
        'end :: resolver / comments ... 2 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: resolver / comments ... 1 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: resolver ... 2 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
        'end :: resolver ... 1 (parent={"id":"1.1"}, next={"count":2,"nodes":[{"id":"1.1.1"},{"id":"1.1.2"}]})',
      ],
      [
        'start :: entity / user.id ... 1 (parent={"id":"1.2"})',
        'start :: entity / user.id ... 2 (parent={"id":"1.2"})',
        'end :: entity / user.id ... 2 (parent={"id":"1.2"}, next="1.2")',
        'end :: entity / user.id ... 1 (parent={"id":"1.2"}, next="1.2")',
      ],
      [
        'start :: resolver ... 1 (parent={"id":"1.2"})',
        'start :: resolver ... 2 (parent={"id":"1.2"})',
        'start :: resolver / comments ... 1 (parent={"id":"1.2"})',
        'start :: resolver / comments ... 2 (parent={"id":"1.2"})',
        'end :: resolver / comments ... 2 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: resolver / comments ... 1 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: resolver ... 2 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
        'end :: resolver ... 1 (parent={"id":"1.2"}, next={"count":2,"nodes":[{"id":"1.2.1"},{"id":"1.2.2"}]})',
      ],
      [
        'start :: entity / user.id ... 1 (parent={"id":"1.1.1"})',
        'start :: entity / user.id ... 1 (parent={"id":"1.1.2"})',
        'start :: entity / user.id ... 1 (parent={"id":"1.2.1"})',
        'start :: entity / user.id ... 1 (parent={"id":"1.2.2"})',

        'start :: entity / user.id ... 2 (parent={"id":"1.1.1"})',
        'start :: entity / user.id ... 2 (parent={"id":"1.1.2"})',
        'start :: entity / user.id ... 2 (parent={"id":"1.2.1"})',
        'start :: entity / user.id ... 2 (parent={"id":"1.2.2"})',

        'end :: entity / user.id ... 2 (parent={"id":"1.1.1"}, next="1.1.1")',
        'end :: entity / user.id ... 2 (parent={"id":"1.1.2"}, next="1.1.2")',
        'end :: entity / user.id ... 2 (parent={"id":"1.2.1"}, next="1.2.1")',
        'end :: entity / user.id ... 2 (parent={"id":"1.2.2"}, next="1.2.2")',

        'end :: entity / user.id ... 1 (parent={"id":"1.1.1"}, next="1.1.1")',
        'end :: entity / user.id ... 1 (parent={"id":"1.1.2"}, next="1.1.2")',
        'end :: entity / user.id ... 1 (parent={"id":"1.2.1"}, next="1.2.1")',
        'end :: entity / user.id ... 1 (parent={"id":"1.2.2"}, next="1.2.2")',
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
    expect(counter).toEqual(62)
  })
})
