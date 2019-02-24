import { GraphQLFieldConfig } from "graphql"

export interface ListOf<P> {
  totalCount: number
  nodes: P[]
}

export interface EdgesOf<P> {
  totalCount: number
  pageInfo: P
  edges: Array<NodeOf<P>>
}

export interface NodeOf<P> {
  cursor: string
  node: P
}

export interface PageInfo {
  endCursor: string | null
  hasNextPage: boolean
}

export interface GraphQLFieldConfigFactoryMap {
  [field: string]: () => GraphQLFieldConfig<any, any>
}
