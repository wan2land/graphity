import { Field, GraphQLEntity } from "graphity"
import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"


@GraphQLEntity({
  description: "todo entity",
})
export class Todo {
  @Field(type => GraphQLID)
  public id!: string

  @Field(type => GraphQLNonNull(GraphQLString), {
    description: "do what you want to do",
  })
  public contents!: string | null

  @Field(type => GraphQLBoolean)
  public isDone!: boolean
}
