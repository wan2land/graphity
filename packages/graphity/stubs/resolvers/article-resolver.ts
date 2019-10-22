import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInputObjectType } from 'graphql'

import { GraphQLResolver, Mutation, Query } from '../../src'
import { Article } from '../entities/article'

@GraphQLResolver(returns => Article)
export class ArticleResolver {

  @Query({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    description: 'this is article',
  })
  public async article(_: null, input: {id: string}) {
    await new Promise(resolve => setTimeout(resolve, 50))
    return Object.assign(new Article(), {
      id: `${input.id}`,
      title: `this is ${input.id} article`,
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
  public async articles(_: null, params: { take?: number, offset?: number }) {
    const take = params.take || 20
    const offset = params.offset || 0
    await new Promise(resolve => setTimeout(resolve, 50))
    return {
      count: 9999,
      nodes: [...new Array(take).keys()].map(i => {
        return Object.assign(new Article(), {
          id: offset + i,
          title: `this is ${offset + i} article`,
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
  public async createArticle(_: null, input: {title: string}) {
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
  public async updateArticle(_: null, input: {id: string, title?: string | null}) {
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
  public async deleteArticle(_: null, input: {id: string}) {
    await new Promise(resolve => setTimeout(resolve, 50))
    return Object.assign(new Article(), {
      id: input.id,
      title: `this is ${input.id}`,
    })
  }
}
