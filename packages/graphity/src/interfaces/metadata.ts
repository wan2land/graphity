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
  typeFactory?: GraphQLResolverTypeFactory | null
  guards: GraphQLGuard<any, any>[]
}

export interface MetadataResolve {
  target: (...args: any[]) => any
  parent?: GraphQLParentTypeFactory | null
  guards: GraphQLGuard<any, any>[]
  name: string
  input?: GraphQLFieldConfigArgumentMap | null
  returns?: GraphQLReturnFactory | null
  description?: string | null
}

export interface MetadataEntity {
  target: any
  name: string
  description?: string | null
}

export interface MetadataField {
  target: any
  property: string | symbol
  typeFactory: GraphQLFieldTypeFactory
  guards: GraphQLGuard<any, any>[]
  name: string
  resolve?: GraphQLFieldResolver<any, any>
  description?: string
}
