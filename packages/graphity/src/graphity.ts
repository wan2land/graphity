import { SharedContainer } from '@graphity/container'
import { GraphQLObjectType, GraphQLSchema, GraphQLString, isOutputType } from 'graphql'

import { InstanceName } from './constants/container'
import { DefaultContextBuilder } from './context/default-context-builder'
import { ConstructType } from './interfaces/common'
import { ContextBuilder, GraphityContext, GraphityOptions, HttpRequest, Middleware } from './interfaces/graphity'
import { MetadataFields, MetadataMutations, MetadataQueries, MetadataResolvers } from './metadata'
import { createMutationObject } from './schema/create-mutation-object'
import { createQueryObject } from './schema/create-query-object'

export class Graphity extends SharedContainer {

  public graphityResolvers: ConstructType<any>[]
  public graphityCommonMiddlewares: ConstructType<Middleware>[]
  public graphityCommonQueryMiddlewares: ConstructType<Middleware>[]
  public graphityCommonMutationMiddlewares: ConstructType<Middleware>[]
  public contextBuilder?: ConstructType<ContextBuilder>

  public constructor(options: GraphityOptions = {}) {
    super()
    this.graphityResolvers = options.resolvers || []
    this.graphityCommonMiddlewares = options.commonMiddlewares || []
    this.graphityCommonQueryMiddlewares = options.commonQueryMiddlewares || []
    this.graphityCommonMutationMiddlewares = options.commonMutationMiddlewares || []
    this.contextBuilder = options.contextBuilder
  }

  public boot(): Promise<void> {
    if (this.contextBuilder) {
      this.bind(InstanceName.ContextBuilder, this.contextBuilder)
    } else {
      this.instance(InstanceName.ContextBuilder, new DefaultContextBuilder(this))
    }

    this.graphityCommonMiddlewares.forEach(middleware => this.bind(middleware, middleware))
    this.graphityCommonQueryMiddlewares.forEach(middleware => this.bind(middleware, middleware))
    this.graphityCommonMutationMiddlewares.forEach(middleware => this.bind(middleware, middleware))

    for (const resolver of this.graphityResolvers) {
      this.bind(resolver, resolver)

      const metadataResolver = MetadataResolvers.get(resolver)
      if (metadataResolver) {
        metadataResolver.middlewares.forEach(middleware => this.bind(middleware, middleware))

        // field middlewares
        const ctorOrType = metadataResolver.typeFactory && metadataResolver.typeFactory(undefined) || GraphQLString
        if (!isOutputType(ctorOrType)) {
          for (const field of MetadataFields.get(ctorOrType) || []) {
            field.middlewares.forEach(middleware => this.bind(middleware, middleware))
          }
        }
      }
      // query & mutation middlewares
      for (const query of MetadataQueries.get(resolver) || []) {
        query.middlewares.forEach(middleware => this.bind(middleware, middleware))
      }
      for (const mutation of MetadataMutations.get(resolver) || []) {
        mutation.middlewares.forEach(middleware => this.bind(middleware, middleware))
      }
    }

    return super.boot()
  }

  public createSchema(): GraphQLSchema {
    const types = new Map<ConstructType<any>, GraphQLObjectType>()

    const queryObject = createQueryObject(this, {
      types,
      resolvers: this.graphityResolvers,
      rootMiddlewares: this.graphityCommonMiddlewares,
      rootQueryMiddlewares: this.graphityCommonQueryMiddlewares,
    })
    const mutationObject = createMutationObject(this, {
      types,
      resolvers: this.graphityResolvers,
      rootMiddlewares: this.graphityCommonMiddlewares,
      rootMutationMiddlewares: this.graphityCommonMutationMiddlewares,
    })
    return new GraphQLSchema({
      query: queryObject,
      mutation: Object.keys(mutationObject.getFields()).length > 0 ? mutationObject : undefined,
    })
  }

  public createContext(request: HttpRequest): Promise<GraphityContext> {
    return this.get<ContextBuilder>(InstanceName.ContextBuilder).buildContext(request)
  }
}
