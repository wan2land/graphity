import { GraphQLFieldConfigArgumentMap } from "graphql"
import { GraphQLGuard } from "./common"
import {
  GraphQLFieldTypeFactory,
  GraphQLParentTypeFactory,
  GraphQLResolverTypeFactory,
  GraphQLReturnFactory
  } from "./decorator"

export interface MetadataResolver {
  target: any
  typeFactory: GraphQLResolverTypeFactory
  guards: GraphQLGuard[]
}

export interface MetadataResolve {
  target: any
  parent?: GraphQLParentTypeFactory
  property: string | symbol
  guards: GraphQLGuard[]
  name: string
  input?: GraphQLFieldConfigArgumentMap
  returns?: GraphQLReturnFactory
  description?: string
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
  guards: GraphQLGuard[]
  name: string
  description?: string
}
