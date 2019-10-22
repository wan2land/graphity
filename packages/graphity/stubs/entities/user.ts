import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'

import { Field, GraphQLEntity } from '../../src'

@GraphQLEntity()
export class User {
  @Field(type => GraphQLNonNull(GraphQLID))
  public id!: string

  @Field(type => GraphQLNonNull(GraphQLString))
  public name!: string
}
