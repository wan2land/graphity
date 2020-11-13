import { GraphQLFieldResolver, GraphQLOutputType, GraphQLFieldConfigArgumentMap } from 'graphql'

import { MiddlewareConstructor } from './middleware'

export type EntityFactory = (type: null) => (GraphQLOutputType | Function)
export type ReturnEntityFactory = (type: GraphQLOutputType) => (GraphQLOutputType | Function)

export interface MetadataResolver {
  target: Function
  typeFactory: EntityFactory
  middlewares: MiddlewareConstructor[]
}

export interface MetadataResolve {
  target: Function
  property: string | symbol
  parent: EntityFactory | null
  name: string
  input: GraphQLFieldConfigArgumentMap | null
  middlewares: MiddlewareConstructor[]
  returns: ReturnEntityFactory
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
  typeFactory: EntityFactory
  middlewares: MiddlewareConstructor[]
  name: string
  resolve: GraphQLFieldResolver<any, any> | null
  description: string | null
  deprecated: string | null
}
