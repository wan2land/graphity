import { Container } from '@graphity/container'
import { GraphQLObjectType } from 'graphql'

import { ConstructType } from '../interfaces/common'
import { MetadataFields } from '../metadata'
import { entityToGraphQLObject } from '../types/entity-to-graphql-object'
import { createResolver } from './create-resolver'

export function entityToBindedGraphQLObject(container: Container, entity: ConstructType<any>): GraphQLObjectType {
  const metaFields = MetadataFields.get(entity) || []
  const type = entityToGraphQLObject(entity)
  const fields = type.getFields()
  for (const metaField of metaFields) {
    fields[metaField.name].resolve = createResolver(container, metaField.middlewares, null, metaField.resolve ? metaField.resolve : (parent: any) => parent[metaField.name])
  }
  return type
}
