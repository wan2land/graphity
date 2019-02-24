import { isInputObjectType } from "graphql"
import { ResolveDecoratorFactory } from "../interfaces/decorator"
import { metadataMutationsMap } from "../metadata"


export const Mutation: ResolveDecoratorFactory = (options) => (target, property) => {
  let resolves = metadataMutationsMap.get(target.constructor)
  if (!resolves) {
    resolves = []
    metadataMutationsMap.set(target.constructor, resolves)
  }
  const guard = (options && options.guards || [])
  const input = options && options.input
  resolves.push({
    target,
    property,
    guards: Array.isArray(guard) ? guard : [guard],
    // parent: Mutation
    input: isInputObjectType(input) ? input.getFields() : input,
    name: (options && options.name) || ((typeof property === "string") ? property : property.toString()),
    returns: options && options.returns,
  })
}
