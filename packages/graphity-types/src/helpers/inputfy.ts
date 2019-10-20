import {
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLObjectType,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from 'graphql'

export function inputfy(type: GraphQLObjectType, options?: { disableRecursive: boolean }): GraphQLInputObjectType {
  return new GraphQLInputObjectType({
    name: `Input${type.name}`,
    fields: Object.entries(type.getFields()).reduce<GraphQLInputFieldConfigMap>((carry, [key, field]) => {
      if (isInterfaceType(field.type) || isUnionType(field.type)) {
        return carry // ignore interface & union
      }
      if (isObjectType(field.type) && options && options.disableRecursive) {
        return carry
      }
      carry[key] = {
        type: isObjectType(field.type) ? inputfy(field.type) : field.type,
        description: field.description,
      }
      return carry
    }, {}),
  })
}
