/* eslint-disable max-classes-per-file */
import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { GraphQLResolver, Query } from '../../src'
import { Comment } from '../entities/comment'
import { createDetector } from '../middlewares/create-detector'
import { Nothing } from '../middlewares/nothing'

@GraphQLResolver(returns => Comment, {
  middlewares: [
    Nothing,
    createDetector('resolver ... 1'),
    Nothing,
    createDetector('resolver ... 2'),
    Nothing,
  ],
})
export class CommentResolver {

  @Query({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    middlewares: createDetector('resolver / comment'),
  })
  public comment(_: null, input: {id: string}) {
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
  public comments(parent: Comment) {
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
