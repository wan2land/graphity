import {
  GraphQLFieldConfigArgumentMap,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType
  } from "graphql"
import { ConstructType, GraphQLGuard } from "./common"

export interface ResolverDecoratorFactoryOption {
  guards?: GraphQLGuard | GraphQLGuard[]
}

export type GraphQLReturnFactory = (type: GraphQLScalarType|GraphQLObjectType) => GraphQLOutputType

export interface ResolveDecoratorFactoryOption {
  name?: string
  input?: GraphQLInputObjectType | GraphQLFieldConfigArgumentMap,
  guards?: GraphQLGuard | GraphQLGuard[]
  returns?: GraphQLReturnFactory
}


export interface EntityDecoratorFactoryOption {
  name?: string
}

export interface FieldDecoratorFactoryOption {
  name?: string
  guards?: GraphQLGuard | GraphQLGuard[]
}


export type GraphQLResolverTypeFactory = (type: any) => GraphQLScalarType | ConstructType<any>
export type GraphQLFieldTypeFactory = (type: any) => GraphQLOutputType

export type ResolverDecoratorFactory = (typeFactory: GraphQLResolverTypeFactory, options?: ResolverDecoratorFactoryOption) => ClassDecorator
export type ResolveDecoratorFactory = (options?: ResolveDecoratorFactoryOption) => MethodDecorator

export type EntityDecoratorFactory = (options?: EntityDecoratorFactoryOption) => ClassDecorator
export type FieldDecoratorFactory = (typeFactory: GraphQLFieldTypeFactory, options?: FieldDecoratorFactoryOption) => PropertyDecorator
