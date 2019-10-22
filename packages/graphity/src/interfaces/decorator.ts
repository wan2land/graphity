import { GraphQLFieldConfigArgumentMap, GraphQLFieldResolver, GraphQLInputObjectType, GraphQLOutputType } from 'graphql'

import { ConstructType, MaybeArray } from './common'
import { Middleware } from './graphity'

export interface ResolverDecoratorFactoryOption {
  middlewares?: MaybeArray<ConstructType<Middleware<any, any>>> | null
}

export type GraphQLParentTypeFactory = (type: any) => ConstructType<any>
export type GraphQLReturnFactory = (type: GraphQLOutputType) => GraphQLOutputType

export interface ResolveDecoratorOption {
  name?: string | null
  parent?: GraphQLParentTypeFactory | null
  input?: GraphQLInputObjectType | GraphQLFieldConfigArgumentMap | null
  middlewares?: MaybeArray<ConstructType<Middleware<any, any>>> | null
  returns?: GraphQLReturnFactory | null
  description?: string | null
  deprecated?: string | null
}


export interface EntityDecoratorOption {
  name?: string | null
  description?: string | null
}

export interface FieldDecoratorOption {
  name?: string | null
  resolve?: GraphQLFieldResolver<any, any> | null
  middlewares?: MaybeArray<ConstructType<Middleware<any, any>>> | null
  description?: string | null
  deprecated?: string | null
}


export type GraphQLResolverTypeFactory = (type: any) => GraphQLOutputType | ConstructType<any>
export type GraphQLFieldTypeFactory = (type: any) => GraphQLOutputType

export type ResolverDecoratorFactory = (typeFactory?: GraphQLResolverTypeFactory | null, options?: ResolverDecoratorFactoryOption) => ClassDecorator
export type ResolveDecoratorFactory = (options?: ResolveDecoratorOption) => MethodDecorator

export type EntityDecoratorFactory = (options?: EntityDecoratorOption) => ClassDecorator
export type FieldDecoratorFactory = (typeFactory: GraphQLFieldTypeFactory, options?: FieldDecoratorOption) => PropertyDecorator
