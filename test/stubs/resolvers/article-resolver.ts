import { Query, GraphQLResolver, GraphQLListOf } from "../../../src"
import { Article } from "../entities/article"

@GraphQLResolver(returns => Article)
export class ArticleResolver {

  @Query()
  public async article() {
    const node = new Article()
    node.id = "1"
    node.title = "hello world"
    return node
  }

  @Query({returns: article => GraphQLListOf(article)})
  public async articles() {
    const node = new Article()
    node.id = "1"
    node.title = "hello world"
    return {
      totalCount: 1,
      nodes: [
        node,
      ],
    }
  }
}
