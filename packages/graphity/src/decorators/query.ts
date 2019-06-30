import { isInputObjectType } from "graphql"
import { ResolveDecoratorFactory } from "../interfaces/decorator"
import { MetadataQueriesMap } from "../metadata"


export const Query: ResolveDecoratorFactory = (options = {}) => (target, property) => {
  let resolves = MetadataQueriesMap.get(target.constructor)
  if (!resolves) {
    resolves = []
    MetadataQueriesMap.set(target.constructor, resolves)
  }
  const guard = options.guards || []
  const input = options.input
  resolves.push({
    target: (target as any)[property],
    parent: options.parent,
    guards: Array.isArray(guard) ? guard : [guard],
    input: isInputObjectType(input) ? input.getFields() : input,
    name: options.name || ((typeof property === "string") ? property : property.toString()),
    returns: options.returns,
    description: options.description,
  })
}
