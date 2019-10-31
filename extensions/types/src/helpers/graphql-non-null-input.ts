import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql'

import { GraphQLInput, GraphQLInputOptions } from './graphql-input'


export function GraphQLNonNullInput(options: GraphQLInputOptions): GraphQLNonNull<GraphQLInputObjectType> {
  return GraphQLNonNull(GraphQLInput(options)) as GraphQLNonNull<GraphQLInputObjectType>
}
