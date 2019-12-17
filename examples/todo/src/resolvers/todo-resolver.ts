import { GraphQLNonNullList } from '@graphity-extensions/types'
import { GraphQLResolver, Mutation, Query } from 'graphity'
import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql'

import { Todo } from '../entities/todo'

let increment = 1

@GraphQLResolver(type => Todo)
export class TodoResolver {

  public nodes: Todo[] = []

  @Query({
    returns: node => GraphQLNonNullList(node),
  })
  public todos() {
    return this.nodes
  }

  @Query({
    input: {
      id: { type: GraphQLID },
    },
  })
  public todo(
    _: null,
    params: { id: string },
  ) {
    return this.nodes.find(({ id }) => id === params.id)
  }

  @Mutation({
    input: {
      input: {
        type: new GraphQLInputObjectType({
          name: 'InputCreateTodo',
          fields: {
            contents: { type: GraphQLNonNull(GraphQLString) },
          },
        }),
      },
    },
  })
  public createTodo(
    _: null,
    params: {
      input: {
        contents: string,
      },
    }
  ) {
    const id = increment++
    const node = Object.assign(new Todo(), {
      id: `${id}`,
      contents: params.input.contents,
      isDone: false,
    })
    this.nodes.push(node)
    return node
  }

  @Mutation({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
      input: {
        type: new GraphQLInputObjectType({
          name: 'InputUpdateTodo',
          fields: {
            contents: { type: GraphQLNonNull(GraphQLString) },
          },
        }),
      },
    },
  })
  public updateTodo(
    _: null,
    params: {
      id: string,
      input: {
        contents: string,
      },
    },
  ) {
    const node = this.nodes.find(({ id }) => id === params.id)
    if (!node) {
      return null
    }
    return Object.assign(node, params.input)
  }

  @Mutation({
    description: 'change \'isDone\' to true',
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  public doneTodo(
    _: null,
    input: {
      id: string,
    },
  ) {
    const node = this.nodes.find(({ id }) => id === input.id)
    if (!node) {
      return null
    }
    return Object.assign(node, {
      isDone: true,
    })
  }

  @Mutation({
    description: 'change \'isDone\' to false',
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  public undoneTodo(
    _: null,
    params: {
      id: string,
    },
  ) {
    const node = this.nodes.find(({ id }) => id === params.id)
    if (!node) {
      return null
    }
    return Object.assign(node, {
      isDone: false,
    })
  }

  @Mutation({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  public deleteTodo(
    _: null,
    input: {
      id: string,
    },
  ) {
    const node = this.nodes.find(({ id }) => id === input.id)
    if (!node) {
      return null
    }
    this.nodes.splice(this.nodes.indexOf(node), 1)
    return node
  }
}
