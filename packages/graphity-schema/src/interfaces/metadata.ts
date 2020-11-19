import { GraphQLFieldResolver, GraphQLOutputType, GraphQLFieldConfigArgumentMap } from 'graphql'

import { MiddlewareClass } from './middleware'

export type EntityFactory = (type: null) => (GraphQLOutputType | Function)
export type ReturnEntityFactory = (type: GraphQLOutputType) => (GraphQLOutputType | Function)

export interface MetadataResolver {
  target: Function
  typeFactory: EntityFactory
  middlewares: MiddlewareClass[]
}

export interface MetadataResolve {
  target: Function
  property: string | symbol
  parent: EntityFactory | null
  name: string
  input: GraphQLFieldConfigArgumentMap | null
  middlewares: MiddlewareClass[]
  returns: ReturnEntityFactory
  description: string | null
  deprecated: string | null
}

export interface MetadataSubscriptionResolve extends MetadataResolve {
  subscribe: GraphQLFieldResolver<any, any>
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
  middlewares: MiddlewareClass[]
  name: string
  description: string | null
  deprecated: string | null
  resolve: GraphQLFieldResolver<any, any> | null
}
