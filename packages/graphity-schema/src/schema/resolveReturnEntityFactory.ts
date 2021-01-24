import { GraphQLOutputType, isOutputType } from 'graphql'

import { ReturnEntityFactory } from '../interfaces/metadata'
import { toGraphQLObject, ToGraphQLObjectParams } from './toGraphQLObject'


export function resolveReturnEntityFactory(factory: ReturnEntityFactory, type: GraphQLOutputType, params?: ToGraphQLObjectParams) {
  const ctorOrType = factory(type)
  return isOutputType(ctorOrType) ? ctorOrType : toGraphQLObject(ctorOrType, params)
}
