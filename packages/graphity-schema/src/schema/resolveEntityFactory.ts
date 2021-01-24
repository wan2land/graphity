import { isOutputType } from 'graphql'

import { EntityFactory } from '../interfaces/metadata'
import { toGraphQLObject, ToGraphQLObjectParams } from './toGraphQLObject'


export function resolveEntityFactory(factory: EntityFactory, params?: ToGraphQLObjectParams) {
  const ctorOrType = factory(null)
  return isOutputType(ctorOrType) ? ctorOrType : toGraphQLObject(ctorOrType, params)
}
