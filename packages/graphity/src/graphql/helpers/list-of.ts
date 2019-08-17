import { ListOf } from '../../interfaces/graphql'

export function listOf<T>(nodes: T[]): ListOf<T> {
  return {
    count: nodes.length,
    nodes,
  }
}
