import { GraphQLSchema } from 'graphql'

import { MetadataStorage } from '../metadata/storage'
import { createMutationObject } from './create-mutation-object'
import { createQueryObject } from './create-query-object'


export interface CreateGraphQLSchemaParams {
  resolvers: Function[]
  metadataStorage?: MetadataStorage
}

export function createGraphQLSchema(params: CreateGraphQLSchemaParams): GraphQLSchema {
  const storage = params.metadataStorage ?? MetadataStorage.getGlobalStorage()

  const query = createQueryObject('Query', params.resolvers, storage)
  const mutation = createMutationObject('Mutation', params.resolvers, storage)

  return new GraphQLSchema({
    ...Object.keys(query.getFields()).length > 0 ? { query } : {},
    ...Object.keys(mutation.getFields()).length > 0 ? { mutation } : {},
  })
}
