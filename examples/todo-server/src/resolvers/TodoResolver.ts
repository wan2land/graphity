import { GraphityContext, GraphityResolver, GraphQLNonNullList, Inject, Mutation, Query, Subscription, withFilter } from 'graphity'
import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import { Connection, In, Repository } from 'typeorm'

import { Todo } from '../entities/Todo'


@GraphityResolver(_ => Todo)
export class TodoResolver {

  constructor(
    @Inject(Connection, c => c.getRepository(Todo)) public repoTodos: Repository<Todo>,
  ) {
  }

  @Query({
    returns: GraphQLNonNullList,
  })
  todos() {
    return this.repoTodos.find({
      order: { id: 'DESC' },
    })
  }

  @Mutation({
    input: {
      input: {
        type: new GraphQLInputObjectType({
          name: 'InputCreateTodo',
          fields: {
            title: { type: GraphQLNonNull(GraphQLString) },
          },
        }),
      },
    },
  })
  createTodo(
    _: null,
    params: {
      input: {
        title: string,
      },
    },
    context: GraphityContext,
  ) {
    return this.repoTodos.save(this.repoTodos.create({
      title: params.input.title,
    })).then((node) => context.$pubsub?.publish('TODO_CREATED', node).then(() => node))
  }

  @Subscription({
    subscribe: (_, params, context: GraphityContext) => {
      return context.$pubsub?.subscribe('TODO_CREATED')
    },
  })
  subscribeTodoCreated(payload: Todo) {
    return payload
  }

  @Mutation({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
      input: {
        type: new GraphQLInputObjectType({
          name: 'InputUpdateTodo',
          fields: {
            title: { type: GraphQLNonNull(GraphQLString) },
            completed: { type: GraphQLNonNull(GraphQLBoolean) },
          },
        }),
      },
    },
  })
  async updateTodo(
    _: null,
    params: {
      id: string,
      input: {
        title: string,
        completed: boolean,
      },
    },
    context: GraphityContext,
  ) {
    const node = await this.repoTodos.findOneOrFail(params.id)
    return this.repoTodos.save(this.repoTodos.merge(node, {
      title: params.input.title,
      completed: params.input.completed,
    })).then((node) => context.$pubsub?.publish('TODOS_UPDATE', [node]).then(() => node))
  }

  @Mutation({
    input: {
      ids: { type: GraphQLNonNullList(GraphQLID) },
    },
    returns: GraphQLNonNullList,
  })
  async completeTodos(
    _: null,
    params: {
      ids: string[],
    },
    context: GraphityContext,
  ) {
    if (params.ids.length === 0) {
      return []
    }

    const nodes = await this.repoTodos.findByIds(params.ids)
    if (nodes.length === 0) {
      return []
    }

    return this.repoTodos.save(nodes.map(node => this.repoTodos.merge(node, {
      completed: true,
    }))).then((nodes) => context.$pubsub?.publish('TODOS_UPDATE', nodes).then(() => nodes))
  }

  @Mutation({
    input: {
      ids: { type: GraphQLNonNullList(GraphQLID) },
    },
    returns: GraphQLNonNullList,
  })
  async uncompleteTodos(
    _: null,
    params: {
      ids: string[],
    },
    context: GraphityContext,
  ) {
    if (params.ids.length === 0) {
      return []
    }

    const nodes = await this.repoTodos.findByIds(params.ids)
    if (nodes.length === 0) {
      return []
    }

    return this.repoTodos.save(nodes.map(node => this.repoTodos.merge(node, {
      completed: false,
    }))).then((nodes) => context.$pubsub?.publish('TODOS_UPDATE', nodes).then(() => nodes))
  }

  @Subscription({
    subscribe: (_: null, params: any, context: GraphityContext) => {
      return context.$pubsub!.subscribe<Todo[]>('TODOS_UPDATE')
    },
    returns: GraphQLNonNullList,
  })
  subscribeTodosUpdated(payload: Todo[]) {
    return payload
  }

  @Mutation({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  async deleteTodo(
    _: null,
    params: {
      id: string,
    },
    context: GraphityContext
  ) {
    const node = await this.repoTodos.findOneOrFail(params.id)
    await this.repoTodos.delete({ id: node.id })
    await context.$pubsub?.publish('TODOS_DELETED', [node])
    return node
  }

  @Mutation({
    input: {
      ids: { type: GraphQLNonNullList(GraphQLID) },
    },
    returns: GraphQLNonNullList,
  })
  async deleteTodos(
    _: null,
    params: {
      ids: string[],
    },
    context: GraphityContext
  ) {
    if (params.ids.length === 0) {
      return []
    }
    const nodes = await this.repoTodos.findByIds(params.ids)
    if (nodes.length === 0) {
      return []
    }

    await this.repoTodos.delete({ id: In(nodes.map(({ id }) => id)) })
    await context.$pubsub?.publish('TODOS_DELETED', nodes)
    return nodes
  }

  @Subscription({
    subscribe: (_: null, params: any, context: GraphityContext) => {
      return context.$pubsub!.subscribe<Todo[]>('TODOS_DELETED')
    },
    returns: GraphQLNonNullList,
  })
  subscribeTodosDeleted(payload: Todo[]) {
    return payload
  }
}
