import { GraphQLFieldConfigMap, GraphQLObjectType, isOutputType } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { MetadataContainer } from '../interfaces/container'


export interface ToGraphQLObjectParams {
  container?: MetadataContainer
}

export function toGraphQLObject(entity: Function, params: ToGraphQLObjectParams = {}): GraphQLObjectType {
  const container = params.container ?? GraphQLContainer.getGlobalContainer()
  const metadataEntity = container.metaEntities.get(entity)

  let cachedObject = container.cachedGraphQLObjects.get(entity)
  if (!cachedObject) {
    cachedObject = new GraphQLObjectType({
      name: metadataEntity?.name ?? entity.name,
      description: metadataEntity?.description,
      fields: () => {
        const metadataFields = container.metaFields.get(entity) ?? []
        return metadataFields.reduce<GraphQLFieldConfigMap<any, any>>((carry, field) => {
          const type = field.typeFactory(null)
          return Object.assign<GraphQLFieldConfigMap<any, any>, GraphQLFieldConfigMap<any, any>>(carry, {
            [field.name]: {
              type: isOutputType(type) ? type : toGraphQLObject(type, params),
              description: field.description ?? null,
              deprecationReason: field.deprecated ?? null,
            },
          })
        }, {})
      },
    })
    container.cachedGraphQLObjects.set(entity, cachedObject)
  }
  return cachedObject
}
