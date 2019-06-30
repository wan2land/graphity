import { GraphQLFieldConfig } from "graphql"

export interface ListOf<P> {
  count: number
  nodes: P[]
}

export interface EdgesOf<P> {
  count: number
  pageInfo: PageInfo
  edges: P[]
}

export interface PageInfo {
  endCursor: string | null
  hasNextPage: boolean
}

export interface GraphQLFieldConfigFactoryMap {
  [field: string]: () => GraphQLFieldConfig<any, any>
}
