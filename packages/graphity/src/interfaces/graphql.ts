import { GraphQLFieldConfig } from 'graphql'

export interface ListOf<T> {
  count: number
  nodes: T[]
}

export interface EdgesOf<T> {
  count: number
  pageInfo: PageInfo
  edges: T[]
}

export interface PageInfo {
  endCursor: string | null
  hasNextPage: boolean
}

export interface GraphQLFieldConfigFactoryMap {
  [field: string]: () => GraphQLFieldConfig<any, any>
}
