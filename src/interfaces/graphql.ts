import { GraphQLFieldConfig } from "graphql"

export interface ListOf<P> {
  totalCount: number
  nodes: P[]
}

export interface GraphQLFieldConfigFactoryMap {
  [field: string]: () => GraphQLFieldConfig<any, any>
}
