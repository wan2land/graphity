import { GraphQLContainer } from '../container/graphql-container'


export interface GraphityEntityParams {
  name?: string
  description?: string
  container?: GraphQLContainer
}

export function GraphityEntity(params: GraphityEntityParams = {}): ClassDecorator {
  const container = params.container ?? GraphQLContainer.getGlobalContainer()
  const metaEntities = container.metaEntities

  return (target) => {
    metaEntities.set(target, {
      target,
      name: params.name ?? target.name,
      description: params.description ?? null,
    })
  }
}
