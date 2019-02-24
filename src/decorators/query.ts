import { ResolveDecoratorFactory } from "../interfaces/decorator"
import { metadataResolvesMap } from "../metadata"


export const Query: ResolveDecoratorFactory = (options) => (target, property) => {
  let resolves = metadataResolvesMap.get(target.constructor)
  if (!resolves) {
    resolves = []
    metadataResolvesMap.set(target.constructor, resolves)
  }
  const guard = (options && options.guards || [])
  resolves.push({
    target,
    property,
    guards: Array.isArray(guard) ? guard : [guard],
    // parent: Query
    input: options && options.input,
    name: (options && options.name) || ((typeof property === "string") ? property : property.toString()),
    returns: options && options.returns,
  })
}
