import { GraphQLFieldResolver, GraphQLOutputType, GraphQLFieldConfigArgumentMap } from 'graphql'

import { MiddlewareConstructor } from './middleware'

export interface MetadataResolver {
  target: Function
  typeFactory: () => GraphQLOutputType | Function
  middlewares: MiddlewareConstructor[]
}

export interface MetadataResolve {
  target: Function
  property: string | symbol
  parent: ((type: null) => GraphQLOutputType | Function) | null
  name: string
  input: GraphQLFieldConfigArgumentMap | null
  middlewares: MiddlewareConstructor[]
  returns: (type: GraphQLOutputType) => GraphQLOutputType | Function
  description: string | null
  deprecated: string | null
}

export interface MetadataEntity {
  target: Function
  name: string
  description: string | null
}

export interface MetadataField {
  target: Function
  property: string | symbol
  typeFactory: (type: any) => GraphQLOutputType | Function
  middlewares: MiddlewareConstructor[]
  name: string
  resolve: GraphQLFieldResolver<any, any> | null
  description: string | null
  deprecated: string | null
}
