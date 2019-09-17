import { GraphQLFieldConfigArgumentMap, GraphQLFieldResolver, GraphQLInputObjectType, GraphQLOutputType } from 'graphql'

import { ConstructType, GraphQLGuard, MaybeArray } from './common'

export interface ResolverDecoratorFactoryOption {
  guards?: MaybeArray<GraphQLGuard<any, any>> | null
}

export type GraphQLParentTypeFactory = (type: any) => ConstructType<any>
export type GraphQLReturnFactory = (type: GraphQLOutputType) => GraphQLOutputType

export interface ResolveDecoratorOption {
  name?: string | null
  parent?: GraphQLParentTypeFactory | null
  input?: GraphQLInputObjectType | GraphQLFieldConfigArgumentMap | null
  guards?: MaybeArray<GraphQLGuard<any, any>> | null
  returns?: GraphQLReturnFactory | null
  description?: string | null
}


export interface EntityDecoratorOption {
  name?: string | null
  description?: string | null
}

export interface FieldDecoratorOption {
  name?: string | null
  guards?: MaybeArray<GraphQLGuard<any, any>> | null
  description?: string | null
  resolve?: GraphQLFieldResolver<any, any>
}


export type GraphQLResolverTypeFactory = (type: any) => GraphQLOutputType | ConstructType<any>
export type GraphQLFieldTypeFactory = (type: any) => GraphQLOutputType

export type ResolverDecoratorFactory = (typeFactory?: GraphQLResolverTypeFactory | null, options?: ResolverDecoratorFactoryOption) => ClassDecorator
export type ResolveDecoratorFactory = (options?: ResolveDecoratorOption) => MethodDecorator

export type EntityDecoratorFactory = (options?: EntityDecoratorOption) => ClassDecorator
export type FieldDecoratorFactory = (typeFactory: GraphQLFieldTypeFactory, options?: FieldDecoratorOption) => PropertyDecorator
