import { createGraphQLSchema, MiddlewareClass, GraphQLContainer } from '@graphity/schema'
import { GraphQLSchema } from 'graphql'

import { InstanceName } from './constants/container'
import { DefaultContextBuilder } from './context/default-context-builder'
import { ContextBuilder, ContextBuilderClass, GraphityContext, HttpRequest } from './interfaces/graphity'


export interface GraphityParams {
  container?: GraphQLContainer

  globalMiddlewares?: MiddlewareClass[]
  queryMiddlewares?: MiddlewareClass[]
  mutationMiddlewares?: MiddlewareClass[]

  resolvers?: Function[]

  contextBuilder?: ContextBuilderClass
}

export class Graphity {

  container: GraphQLContainer

  globalMiddlewares: MiddlewareClass[]
  queryMiddlewares: MiddlewareClass[]
  mutationMiddlewares: MiddlewareClass[]

  resolvers: Function[]

  contextBuilder?: ContextBuilderClass

  constructor(options: GraphityParams = {}) {
    this.container = options.container ?? GraphQLContainer.getGlobalContainer()

    this.globalMiddlewares = options.globalMiddlewares ?? []
    this.queryMiddlewares = options.queryMiddlewares ?? []
    this.mutationMiddlewares = options.mutationMiddlewares ?? []

    this.resolvers = options.resolvers ?? []

    this.contextBuilder = options.contextBuilder
  }

  boot(): Promise<void> {
    if (this.contextBuilder) {
      this.container.bind(InstanceName.ContextBuilder, this.contextBuilder)
    } else {
      this.container.instance(InstanceName.ContextBuilder, new DefaultContextBuilder(this.container))
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

  createContext(request: HttpRequest): Promise<GraphityContext> {
    return this.container.get<ContextBuilder>(InstanceName.ContextBuilder).buildContext(request)
  }
}
