import { MetadataStorable } from '@graphity/schema'

function findFunctionsFromExported(exported: any): Function[] {
  if (typeof exported === 'function') {
    return [exported]
  }
  if (Array.isArray(exported)) {
    return exported.reduce((carry, nextExported) => (carry = carry.concat(findFunctionsFromExported(nextExported))), [] as Function[])
  }
  if (typeof exported === 'object') {
    return Object.keys(exported).reduce((carry, key) => (carry = carry.concat(findFunctionsFromExported(exported[key]))), [] as Function[])
  }
  return []
}

export function findResolvers(storage: MetadataStorable, resolvers: (Function | string)[]): Function[] {
  const resolversToReturn = [] as Function[]
  for (const resolver of resolvers) {
    if (typeof resolver === 'function') {
      resolversToReturn.push(resolver)
    } else if (typeof resolver === 'string') {
      const foundResolvers = findFunctionsFromExported(require(resolver)) // eslint-disable-line import/no-dynamic-require,@typescript-eslint/no-require-imports
      resolversToReturn.push(...foundResolvers.filter(foundResolver => storage.resolvers.has(foundResolver)))
    }
  }

  return resolversToReturn
}
