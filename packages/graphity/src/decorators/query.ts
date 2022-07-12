import { isInputObjectType } from 'graphql'
import { ResolveDecoratorFactory } from '../interfaces/decorator'
import { MetadataQueries } from '../metadata'


export const Query: ResolveDecoratorFactory = (options = {}) => (target, property) => {
  let resolves = MetadataQueries.get(target.constructor)
  if (!resolves) {
    resolves = []
    MetadataQueries.set(target.constructor, resolves)
  }
  const guard = options.guards || []
  const input = options.input
  resolves.push({
    target: (target as any)[property],
    parent: options.parent || undefined,
    guards: Array.isArray(guard) ? guard : [guard],
    input: (isInputObjectType(input) ? input.getFields() : input) || undefined,
    name: options.name || (typeof property === 'string' ? property : property.toString()),
    returns: options.returns || undefined,
    description: options.description || undefined,
  })
}
