import { GraphQLSchema } from 'graphql'

import { MetadataStorable } from '../interfaces/metadata'
import { MetadataStorage } from '../metadata/MetadataStorage'
import { createMutationObject } from './createMutationObject'
import { createQueryObject } from './createQueryObject'
import { createSubscriptionObject } from './createSubscriptionObject'


export interface CreateGraphQLSchemaParams {
  resolvers: Function[]
  storage?: MetadataStorable
}

export function createGraphQLSchema(params: CreateGraphQLSchemaParams): GraphQLSchema {
  const storage = params.storage ?? MetadataStorage.getGlobalStorage()

  const query = createQueryObject({
    storage,
    name: 'Query',
    resolvers: params.resolvers,
  })
  const mutation = createMutationObject({
    storage,
    name: 'Mutation',
    resolvers: params.resolvers,
  })
  const subscription = createSubscriptionObject({
    storage,
    name: 'Subscription',
    resolvers: params.resolvers,
  })

  return new GraphQLSchema({
    ...Object.keys(query.getFields()).length > 0 ? { query } : {},
    ...Object.keys(mutation.getFields()).length > 0 ? { mutation } : {},
    ...Object.keys(subscription.getFields()).length > 0 ? { subscription } : {},
  })
}
