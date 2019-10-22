import { GraphQLFieldConfigArgumentMap, GraphQLFieldResolver } from 'graphql'

import { ConstructType } from './common'
import {
  GraphQLFieldTypeFactory,
  GraphQLParentTypeFactory,
  GraphQLResolverTypeFactory,
  GraphQLReturnFactory,
} from './decorator'
import { Middleware } from './graphity'

export interface MetadataResolver {
  target: any
  typeFactory?: GraphQLResolverTypeFactory
  middlewares: ConstructType<Middleware<any, any>>[]
}

export interface MetadataResolve {
  target: (...args: any[]) => any
  parent?: GraphQLParentTypeFactory
  middlewares: ConstructType<Middleware<any, any>>[]
  name: string
  input?: GraphQLFieldConfigArgumentMap
  returns?: GraphQLReturnFactory
  description?: string
  deprecated?: string
}

export interface MetadataEntity {
  target: any
  name: string
  description?: string
}

export interface MetadataField {
  target: any
  property: string | symbol
  typeFactory: GraphQLFieldTypeFactory
  middlewares: ConstructType<Middleware<any, any>>[]
  name: string
  resolve?: GraphQLFieldResolver<any, any>
  description?: string
  deprecated?: string
}
