import { GraphQLNonNull, GraphQLID } from "graphql"
import { GraphQLListOf, GraphQLResolver, Query, listOf } from "../../../src"
import { Article } from "../entities/article"

@GraphQLResolver(returns => Article)
export class ArticleResolver {

  @Query({
    input: {
      id: {type: GraphQLNonNull(GraphQLID)},
    },
  })
  public async article(parent: null, input: {id: string}) {
    return Object.assign(new Article(), {
      id: `${input.id}`,
      title: `this is ${input.id}`,
    })
  }

  @Query({returns: article => GraphQLListOf(article)})
  public async articles() {
    return listOf([
      Object.assign(new Article(), {
        id: "1",
        title: "this is 1",
      })
    ])
  }
}
