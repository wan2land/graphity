import { isInputObjectType } from 'graphql'

import { ConstructType } from '../interfaces/common'
import { ResolveDecoratorFactory } from '../interfaces/decorator'
import { MetadataMutations } from '../metadata'


export const Mutation: ResolveDecoratorFactory = (options = {}) => (target, property) => {
  let resolves = MetadataMutations.get(target.constructor as any as ConstructType<any>)
  if (!resolves) {
    resolves = []
    MetadataMutations.set(target.constructor as any as ConstructType<any>, resolves)
  }
  const middleware = options.middlewares || []
  const input = options.input
  resolves.push({
    target: (target as any)[property],
    parent: options.parent || undefined,
    middlewares: Array.isArray(middleware) ? middleware : [middleware],
    input: (isInputObjectType(input) ? input.getFields() : input) || undefined,
    name: options.name || (typeof property === 'string' ? property : property.toString()),
    returns: options.returns || undefined,
    description: options.description || undefined,
  })
}
