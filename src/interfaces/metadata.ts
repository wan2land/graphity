import { GraphQLGuard } from "./common"
import { GraphQLFieldTypeFactory, GraphQLResolverTypeFactory, GraphQLReturnFactory } from "./decorator"

export interface MetadataResolver {
  target: any
  typeFactory: GraphQLResolverTypeFactory
  guards: GraphQLGuard[]
}

export interface MetadataResolve {
  target: any
  property: string | symbol
  guards: GraphQLGuard[]
  name: string
  returns?: GraphQLReturnFactory
}

export interface MetadataEntity {
  target: any
  name: string
}

export interface MetadataField {
  target: any
  property: string | symbol
  typeFactory: GraphQLFieldTypeFactory
  guards: GraphQLGuard[]
  name: string
}
