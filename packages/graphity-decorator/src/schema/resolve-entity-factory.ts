import { GraphQLOutputType, isOutputType } from 'graphql'

import { EntityFactory, ReturnEntityFactory } from '../interfaces/metadata'
import { toGraphQLObject, ToGraphQLObjectParams } from './to-graphql-object'

export function resolveEntityFactory(factory: EntityFactory, params?: ToGraphQLObjectParams) {
  const ctorOrType = factory(null)
  return isOutputType(ctorOrType) ? ctorOrType : toGraphQLObject(ctorOrType, params)
}

export function resolveReturnEntityFactory(factory: ReturnEntityFactory, type: GraphQLOutputType, params?: ToGraphQLObjectParams) {
  const ctorOrType = factory(type)
  return isOutputType(ctorOrType) ? ctorOrType : toGraphQLObject(ctorOrType, params)
}
