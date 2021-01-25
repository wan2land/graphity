import { GraphQLObjectType, isOutputType } from 'graphql'

import { ReturnTypeFactory } from '../interfaces/metadata'
import { toGraphQLObject, ToGraphQLObjectParams } from './toGraphQLObject'


export function resolveReturnEntityFactory(factory: ReturnTypeFactory, type: GraphQLObjectType, params?: ToGraphQLObjectParams) {
  const ctorOrType = factory(type)
  return isOutputType(ctorOrType) ? ctorOrType : toGraphQLObject(ctorOrType, params)
}
