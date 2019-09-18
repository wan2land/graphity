import { GraphQLFieldConfigArgumentMap, GraphQLFieldResolver } from 'graphql'

import { GraphQLGuard } from './common'
import {
  GraphQLFieldTypeFactory,
  GraphQLParentTypeFactory,
  GraphQLResolverTypeFactory,
  GraphQLReturnFactory,
} from './decorator'

export interface MetadataResolver {
  target: any
  typeFactory?: GraphQLResolverTypeFactory
  guards: GraphQLGuard<any, any>[]
}

export interface MetadataResolve {
  target: (...args: any[]) => any
  parent?: GraphQLParentTypeFactory
  guards: GraphQLGuard<any, any>[]
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
  guards: GraphQLGuard<any, any>[]
  name: string
  resolve?: GraphQLFieldResolver<any, any>
  description?: string
  deprecated?: string
}
