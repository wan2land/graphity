import { GraphQLInputFieldConfigMap, GraphQLInputObjectType, GraphQLInputType, isInputType } from 'graphql'

export interface CreateGraphQLInputFieldMap {
  [name: string]: CreateGraphQLInputFieldMap | GraphQLInputType
}

export interface CreateGraphQLInputOptions {
  name: string
  description?: string | null
  fields: CreateGraphQLInputFieldMap
}

export function createGraphQLInput(options: CreateGraphQLInputOptions): GraphQLInputObjectType {
  return new GraphQLInputObjectType({
    name: options.name,
    description: options.description,
    fields: Object.entries(options.fields).reduce<GraphQLInputFieldConfigMap>((carry, [key, field]) => {
      if (isInputType(field)) {
        carry[key] = { type: field }
        return carry // ignore interface & union
      }
      carry[key] = {
        type: createGraphQLInput({
          name: `${options.name}${key[0].toUpperCase()}${key.slice(1)}`,
          fields: field,
        }),
      }
      return carry
    }, {}),
  })
}
