import { isInputObjectType } from "graphql"
import { ResolveDecoratorFactory } from "../interfaces/decorator"
import { metadataQueriesMap } from "../metadata"


export const Query: ResolveDecoratorFactory = (options = {}) => (target, property) => {
  let resolves = metadataQueriesMap.get(target.constructor)
  if (!resolves) {
    resolves = []
    metadataQueriesMap.set(target.constructor, resolves)
  }
  const guard = options.guards || []
  const input = options.input
  resolves.push({
    target,
    parent: options.parent,
    property,
    guards: Array.isArray(guard) ? guard : [guard],
    input: isInputObjectType(input) ? input.getFields() : input,
    name: options.name || ((typeof property === "string") ? property : property.toString()),
    returns: options.returns,
    description: options.description,
  })
}
