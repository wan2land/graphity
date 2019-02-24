import { GraphQLNonNull, GraphQLID, GraphQLObjectType, GraphQLInputObjectType } from "graphql"
import { GraphQLListOf, GraphQLResolver, Query } from "../../../src"
import { Article } from "../entities/article"

@GraphQLResolver(returns => Article)
export class ArticleResolver {

  @Query({
    input: {
      id: {type: GraphQLNonNull(GraphQLID)},
    },
  })
  public async article(parent: null, input: {id: string}) {
    const node = new Article()
    node.id = `${input.id}`
    node.title = `this is ${input.id}`
    return node
  }

  @Query({returns: article => GraphQLListOf(article)})
  public async articles() {
    const node = new Article()
    node.id = "1"
    node.title = `this is 1`
    return {
      totalCount: 1,
      nodes: [
        node,
      ],
    }
  }
}
