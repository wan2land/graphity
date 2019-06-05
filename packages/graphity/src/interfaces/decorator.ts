import { GraphQLFieldConfigArgumentMap, GraphQLInputObjectType, GraphQLOutputType } from "graphql"

import { ConstructType, GraphQLGuard } from "./common"

export interface ResolverDecoratorFactoryOption {
  guards?: GraphQLGuard | GraphQLGuard[]
}

export type GraphQLParentTypeFactory = (type: any) => ConstructType<any>
export type GraphQLReturnFactory = (type: GraphQLOutputType) => GraphQLOutputType

export interface ResolveDecoratorOption {
  name?: string
  parent?: GraphQLParentTypeFactory
  input?: GraphQLInputObjectType | GraphQLFieldConfigArgumentMap
  guards?: GraphQLGuard | GraphQLGuard[]
  returns?: GraphQLReturnFactory
  description?: string
}


export interface EntityDecoratorOption {
  name?: string
  description?: string
}

export interface FieldDecoratorOption {
  name?: string
  guards?: GraphQLGuard | GraphQLGuard[]
  description?: string
}


export type GraphQLResolverTypeFactory = (type: any) => GraphQLOutputType | ConstructType<any>
export type GraphQLFieldTypeFactory = (type: any) => GraphQLOutputType

export type ResolverDecoratorFactory = (typeFactory?: GraphQLResolverTypeFactory | null, options?: ResolverDecoratorFactoryOption) => ClassDecorator
export type ResolveDecoratorFactory = (options?: ResolveDecoratorOption) => MethodDecorator

export type EntityDecoratorFactory = (options?: EntityDecoratorOption) => ClassDecorator
export type FieldDecoratorFactory = (typeFactory: GraphQLFieldTypeFactory, options?: FieldDecoratorOption) => PropertyDecorator
