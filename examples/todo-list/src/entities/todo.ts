import { Field, GraphQLEntity } from "graphity"
import { GraphQLID, GraphQLString } from "graphql"


@GraphQLEntity()
export class Todo {
  @Field(type => GraphQLID)
  public id!: string

  @Field(type => GraphQLString)
  public contents!: string | null
}
