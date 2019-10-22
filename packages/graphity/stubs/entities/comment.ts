/* eslint-disable max-classes-per-file */
import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import { Field, GraphQLEntity } from '../../src'
import { createDetector } from '../middlewares/create-detector'
import { Nothing } from '../middlewares/nothing'

@GraphQLEntity()
export class Comment {
  @Field(type => GraphQLNonNull(GraphQLID), {
    middlewares: [
      Nothing,
      createDetector('entity / user.id ... 1'),
      Nothing,
      createDetector('entity / user.id ... 2'),
      Nothing,
    ],
  })
  public id!: string
}
