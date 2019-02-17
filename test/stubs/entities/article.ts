import { GraphQLID, GraphQLString, GraphQLNonNull } from "graphql"
import { GraphQLEntity, Field } from "../../../src"

@GraphQLEntity()
export class Article {
  @Field(type => GraphQLNonNull(GraphQLID))
  public id!: string

  @Field(type => GraphQLNonNull(GraphQLString))
  public title!: string
}
