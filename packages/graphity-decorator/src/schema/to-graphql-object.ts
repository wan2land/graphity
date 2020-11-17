import { GraphQLFieldConfigMap, GraphQLObjectType, isOutputType } from 'graphql'

import { GraphQLContainer } from '../container/graphql-container'
import { applyMiddlewares } from '../resolver/apply-middlewares'


export interface ToGraphQLObjectParams {
  container?: GraphQLContainer
}

export function toGraphQLObject(entity: Function, params: ToGraphQLObjectParams = {}): GraphQLObjectType {
  const container = params.container ?? GraphQLContainer.getGlobalContainer()
  const metaEntity = container.metaEntities.get(entity)

  let cachedObject = container.cachedGraphQLObjects.get(entity)
  if (!cachedObject) {
    cachedObject = new GraphQLObjectType({
      name: metaEntity?.name ?? entity.name,
      description: metaEntity?.description,
      fields: () => {
        const metaFields = container.metaFields.get(entity) ?? []
        return metaFields.reduce<GraphQLFieldConfigMap<any, any>>((carry, metaField) => {
          const type = metaField.typeFactory(null)
          return Object.assign<GraphQLFieldConfigMap<any, any>, GraphQLFieldConfigMap<any, any>>(carry, {
            [metaField.name]: {
              type: isOutputType(type) ? type : toGraphQLObject(type, params),
              description: metaField.description ?? null,
              deprecationReason: metaField.deprecated ?? null,
              resolve: applyMiddlewares(
                metaField.middlewares.map(middleware => container.get(middleware)),
                metaField.resolve ? metaField.resolve : (parent) => parent[metaField.name]
              ),
            },
          })
        }, {})
      },
    })
    container.cachedGraphQLObjects.set(entity, cachedObject)
  }
  return cachedObject
}
