import { GraphQLID, GraphQLString, GraphQLNonNull } from "graphql"
import { GraphQLEntity, Field } from "../../../src"

@GraphQLEntity()
export class User {
  @Field(type => GraphQLNonNull(GraphQLID))
  public id!: string

  @Field(type => GraphQLNonNull(GraphQLString))
  public name!: string
}
