import { GraphQLID, GraphQLString, GraphQLNonNull } from "graphql"
import { GraphQLEntity, Field } from "../../../src"

@GraphQLEntity({
  description: "article entity"
})
export class Article {
  @Field(type => GraphQLNonNull(GraphQLID), {
    description: "article id",
  })
  public id!: string

  @Field(type => GraphQLNonNull(GraphQLString))
  public title!: string

  @Field(type => GraphQLString)
  public contents?: string | null
}
