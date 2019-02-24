import { isInputObjectType } from "graphql"
import { ResolveDecoratorFactory } from "../interfaces/decorator"
import { metadataQueriesMap } from "../metadata"


export const Query: ResolveDecoratorFactory = (options) => (target, property) => {
  let resolves = metadataQueriesMap.get(target.constructor)
  if (!resolves) {
    resolves = []
    metadataQueriesMap.set(target.constructor, resolves)
  }
  const guard = (options && options.guards || [])
  const input = options && options.input
  resolves.push({
    target,
    property,
    guards: Array.isArray(guard) ? guard : [guard],
    // parent: Query
    input: isInputObjectType(input) ? input.getFields() : input,
    name: (options && options.name) || ((typeof property === "string") ? property : property.toString()),
    returns: options && options.returns,
  })
}
