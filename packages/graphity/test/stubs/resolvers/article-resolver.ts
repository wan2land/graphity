import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import { GraphQLInputPagination, GraphQLListOf, GraphQLResolver, listOf, Mutation, Query } from '../../../lib'
import { Article } from '../entities/article'

@GraphQLResolver(returns => Article)
export class ArticleResolver {

  @Query({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    description: 'this is article',
  })
  public async article(parent: null, input: {id: string}) {
    return Object.assign(new Article(), {
      id: `${input.id}`,
      title: `this is ${input.id}`,
    })
  }

  @Query({
    returns: article => GraphQLListOf(article as GraphQLObjectType),
    input: GraphQLInputPagination,
  })
  public async articles() {
    return listOf([
      Object.assign(new Article(), {
        id: '1',
        title: 'this is 1',
      }),
    ])
  }

  @Mutation({
    input: {
      title: {
        type: GraphQLNonNull(GraphQLString),
      },
    },
    description: 'this is createArticle',
  })
  public async createArticle(parent: null, input: {title: string}) {
    return Object.assign(new Article(), {
      id: '2',
      title: input.title,
    })
  }

  @Mutation({
    input: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
      title: {
        type: GraphQLString,
      },
    },
  })
  public async updateArticle(parent: null, input: {id: string, title?: string | null}) {
    return Object.assign(new Article(), {
      id: input.id,
      title: typeof input.title === 'undefined' ? `this is ${input.id}` : input.title,
    })
  }

  @Mutation({
    input: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
  })
  public async deleteArticle(parent: null, input: {id: string}) {
    return Object.assign(new Article(), {
      id: input.id,
      title: `this is ${input.id}`,
    })
  }
}
