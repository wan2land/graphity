import { Provider } from '@graphity/container'
import { createGraphQLSchema, MiddlewareClass, GraphQLContainer } from '@graphity/schema'
import { GraphQLSchema } from 'graphql'

import { InstanceName } from './constants/container'
import { GraphityContextBuilder } from './context-builder/graphity-context-builder'
import { GraphityContext } from './interfaces/graphity'
import { ContextBuilder, ContextBuilderClass, HttpRequest } from './interfaces/graphql'


export interface GraphityParams {
  container?: GraphQLContainer

  globalMiddlewares?: MiddlewareClass[]
  queryMiddlewares?: MiddlewareClass[]
  mutationMiddlewares?: MiddlewareClass[]

  resolvers?: Function[]

  contextBuilder?: ContextBuilderClass<any>
}

export class Graphity<TContext = GraphityContext> {

  container: GraphQLContainer

  globalMiddlewares: MiddlewareClass[]
  queryMiddlewares: MiddlewareClass[]
  mutationMiddlewares: MiddlewareClass[]

  resolvers: Function[]

  constructor(options: GraphityParams = {}) {
    this.container = options.container ?? GraphQLContainer.getGlobalContainer()

    this.globalMiddlewares = options.globalMiddlewares ?? []
    this.queryMiddlewares = options.queryMiddlewares ?? []
    this.mutationMiddlewares = options.mutationMiddlewares ?? []

    this.resolvers = options.resolvers ?? []
  }

  register(provider: Provider): this {
    this.container.register(provider)
    return this
  }

  boot(): Promise<void> {
    if (!this.container.has(InstanceName.ContextBuilder)) {
      this.container.instance(InstanceName.ContextBuilder, new GraphityContextBuilder(this.container))
    }

    this.globalMiddlewares.forEach(middleware => this.container.bind(middleware, middleware))
    this.queryMiddlewares.forEach(middleware => this.container.bind(middleware, middleware))
    this.mutationMiddlewares.forEach(middleware => this.container.bind(middleware, middleware))

    this.container.instance(Graphity, this)
    this.container.instance(GraphQLContainer, this.container)

    return this.container.boot()
  }

  createSchema(): GraphQLSchema {
    return createGraphQLSchema({
      container: this.container,
      resolvers: this.resolvers,
      globalMiddlewares: this.globalMiddlewares,
      mutationMiddlewares: this.mutationMiddlewares,
      queryMiddlewares: this.queryMiddlewares,
    })
  }

  createContext(request: HttpRequest): Promise<TContext> {
    return this.container.get<ContextBuilder<TContext>>(InstanceName.ContextBuilder).buildContext(request)
  }
}
