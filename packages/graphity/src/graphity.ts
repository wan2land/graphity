import { Container } from '@graphity/container'
import { GraphQLObjectType, GraphQLSchema, GraphQLString, isOutputType } from 'graphql'

import { ConstructType } from './interfaces/common'
import { GraphityOptions, HttpRequest, Middleware } from './interfaces/graphity'
import { MetadataFields, MetadataMutations, MetadataQueries, MetadataResolvers } from './metadata'
import { createMutationObject } from './schema/create-mutation-object'
import { createQueryObject } from './schema/create-query-object'
import { ContextFactory } from './schema/context-factory'

export class Graphity extends Container {

  public options: GraphityOptions

  public constructor(options: Partial<GraphityOptions> = {}) {
    super()
    this.options = {
      entries: options.entries || [],
      commonMiddlewares: options.commonMiddlewares || [],
      commonQueryMiddlewares: options.commonQueryMiddlewares || [],
      commonMutationMiddlewares: options.commonMutationMiddlewares || [],
    }
  }

  public boot(): Promise<void> {
    if (!this.descriptors.has(ContextFactory)) {
      this.bind(ContextFactory, ContextFactory) // default context factory
    }

    const middlewareClassSet = new Set<ConstructType<Middleware>>()
    const resolverClassSet = new Set<ConstructType<any>>()

    for (const middleware of this.options.commonMiddlewares) {
      middlewareClassSet.add(middleware)
    }
    for (const middleware of this.options.commonQueryMiddlewares) {
      middlewareClassSet.add(middleware)
    }
    for (const middleware of this.options.commonMutationMiddlewares) {
      middlewareClassSet.add(middleware)
    }
    for (const resolver of this.options.entries) {
      resolverClassSet.add(resolver)

      const metadataResolver = MetadataResolvers.get(resolver)
      if (metadataResolver) {
        for (const middleware of metadataResolver.middlewares) {
          middlewareClassSet.add(middleware)
        }

        // field middlewares
        const ctorOrType = metadataResolver.typeFactory && metadataResolver.typeFactory(undefined) || GraphQLString
        if (!isOutputType(ctorOrType)) {
          for (const field of MetadataFields.get(ctorOrType) || []) {
            for (const middleware of field.middlewares) {
              middlewareClassSet.add(middleware)
            }
          }
        }
      }
      // query & mutation middlewares
      for (const query of MetadataQueries.get(resolver) || []) {
        for (const middleware of query.middlewares) {
          middlewareClassSet.add(middleware)
        }
      }
      for (const mutation of MetadataMutations.get(resolver) || []) {
        for (const middleware of mutation.middlewares) {
          middlewareClassSet.add(middleware)
        }
      }
    }

    const middlewareClasses = [...middlewareClassSet]
    const resolverClasses = [...resolverClassSet]
    return super.boot()
      .then(() => Promise.all(middlewareClasses.map(middleware => this.create(middleware))))
      .then((middlewares) => {
        middlewares.forEach((middleware, middlewareIndex) => {
          this.instances.set(middlewareClasses[middlewareIndex], middleware)
        })
        return Promise.all(resolverClasses.map(resolver => this.create(resolver)))
      })
      .then((resolvers) => {
        resolvers.forEach((resolver, resolverIndex) => {
          this.instances.set(resolverClasses[resolverIndex], resolver)
        })
        return Promise.resolve()
      })
  }

  public createSchema(): GraphQLSchema {
    const types = new Map<ConstructType<any>, GraphQLObjectType>()

    const queryObject = createQueryObject(this, {
      types,
      resolvers: this.options.entries,
      rootMiddlewares: this.options.commonMiddlewares,
      rootQueryMiddlewares: this.options.commonQueryMiddlewares,
    })
    const mutationObject = createMutationObject(this, {
      types,
      resolvers: this.options.entries,
      rootMiddlewares: this.options.commonMiddlewares,
      rootMutationMiddlewares: this.options.commonMutationMiddlewares,
    })
    return new GraphQLSchema({
      query: queryObject,
      mutation: Object.keys(mutationObject.getFields()).length > 0 ? mutationObject : undefined,
    })
  }

  public createContext(request: HttpRequest) {
    return this.get(ContextFactory).then(factory => factory.factory(request))
  }
}
