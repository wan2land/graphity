import { GraphQLObjectType } from 'graphql'

import { MetadataEntity, MetadataField, MetadataResolve, MetadataFieldResolve, MetadataResolver, MetadataStorable, MetadataSubscriptionResolve, GraphQLEntityType } from '../interfaces/metadata'

let globalStorage: MetadataStorable | null = null

export class MetadataStorage implements MetadataStorable {

  static clearGlobalStorage() {
    globalStorage = null
  }

  static getGlobalStorage(): MetadataStorable {
    if (!globalStorage) {
      globalStorage = new MetadataStorage()
    }
    return globalStorage
  }

  resolvers = new Map<Function, MetadataResolver>()
  queries = new Map<Function, MetadataResolve[]>()
  mutations = new Map<Function, MetadataResolve[]>()
  subscriptions = new Map<Function, MetadataSubscriptionResolve[]>()

  entities = new Map<Function, MetadataEntity>()
  fields = new Map<Function, MetadataField[]>()

  entityToGqlObject = new Map<Function, GraphQLObjectType>()
  gqlEntityToResolves = new Map<GraphQLEntityType, MetadataFieldResolve[]>()

  getOrCreateGraphQLEntity(entity: Function, creator: () => GraphQLObjectType): GraphQLObjectType {
    let gqlEntity = this.entityToGqlObject.get(entity)
    if (!gqlEntity) {
      gqlEntity = creator()
      this.entityToGqlObject.set(entity, gqlEntity)
    }
    return gqlEntity
  }

  saveGraphQLFieldResolve(entity: GraphQLEntityType, resolve: MetadataFieldResolve): void {
    let fieldResolves = this.gqlEntityToResolves.get(entity)
    if (!fieldResolves) {
      fieldResolves = []
      this.gqlEntityToResolves.set(entity, fieldResolves)
    }
    fieldResolves.push(resolve)
  }

  saveGraphQLFieldResolves(entity: GraphQLEntityType, resolves: MetadataFieldResolve[]): void {
    let fieldResolves = this.gqlEntityToResolves.get(entity)
    if (!fieldResolves) {
      fieldResolves = []
    }
    this.gqlEntityToResolves.set(entity, fieldResolves.concat(resolves))
  }

  getGraphQLFieldResolves(): Map<GraphQLEntityType, MetadataFieldResolve[]> {
    return this.gqlEntityToResolves
  }

  findGraphQLFieldResolves(entity: GraphQLEntityType): MetadataFieldResolve[] {
    return this.gqlEntityToResolves.get(entity) ?? []
  }
}
