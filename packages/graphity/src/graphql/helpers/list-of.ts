import { ListOf } from "../../interfaces/graphql"

export function listOf<P>(nodes: P[]): ListOf<P> {
  return {
    count: nodes.length,
    nodes,
  }
}
