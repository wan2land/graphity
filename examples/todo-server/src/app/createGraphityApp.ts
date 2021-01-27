import { Graphity } from 'graphity'

import { TypeormProvider } from '../providers/TypeormProvider'
import { TodoResolver } from '../resolvers/TodoResolver'


export function createGraphityApp() {
  const graphity = new Graphity({
    resolvers: [
      TodoResolver,
    ],
  })

  graphity.register(new TypeormProvider())

  return graphity
}
