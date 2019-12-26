import {
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLObjectType,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from 'graphql'

export interface InputifyOptions {
  name?: string
  disableRecursive?: boolean
  except?: string[]
}

export function inputify(type: GraphQLObjectType, options?: InputifyOptions): GraphQLInputObjectType {
  const except = options && options.except || []
  return new GraphQLInputObjectType({
    name: options && options.name || `Input${type.name}`,
    fields: Object.entries(type.getFields()).reduce<GraphQLInputFieldConfigMap>((carry, [key, field]) => {
      if (isInterfaceType(field.type) || isUnionType(field.type)) {
        return carry // ignore interface & union
      }
      if (isObjectType(field.type) && options && options.disableRecursive) {
        return carry
      }
      if (except.includes(key)) {
        return carry
      }
      carry[key] = {
        type: isObjectType(field.type) ? inputify(field.type) : field.type,
        description: field.description,
      }
      return carry
    }, {}),
  })
}
