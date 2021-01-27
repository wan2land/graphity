import { GraphityResolver, GraphQLNonNullList, Inject, Mutation, Query } from 'graphity'
import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import { Connection, Repository } from 'typeorm'

import { Todo } from '../entities/Todo'

@GraphityResolver(type => Todo)
export class TodoResolver {

  constructor(
    @Inject(Connection) public repoTodos: Repository<Todo>,
  ) {
    //
  }

  @Query({
    returns: node => GraphQLNonNullList(node),
  })
  todos() {
    console.log(this)
    return this.repoTodos.find()
  }

  @Query({
    input: {
      id: { type: GraphQLID },
    },
  })
  todo(
    _: null,
    params: { id: string },
  ) {
    // return this.nodes.find(({ id }) => id === params.id)
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
  createTodo(
    _: null,
    params: {
      input: {
        contents: string,
      },
    }
  ) {
    // const id = increment++
    // const node = Object.assign(new Todo(), {
    //   id: `${id}`,
    //   contents: params.input.contents,
    //   isDone: false,
    // })
    // this.nodes.push(node)
    // return node
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
  updateTodo(
    _: null,
    params: {
      id: string,
      input: {
        contents: string,
      },
    },
  ) {
    // const node = this.nodes.find(({ id }) => id === params.id)
    // if (!node) {
    //   return null
    // }
    // return Object.assign(node, params.input)
  }

  @Mutation({
    description: 'change \'isDone\' to true',
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  doneTodo(
    _: null,
    input: {
      id: string,
    },
  ) {
    // const node = this.nodes.find(({ id }) => id === input.id)
    // if (!node) {
    //   return null
    // }
    // return Object.assign(node, {
    //   isDone: true,
    // })
  }

  @Mutation({
    description: 'change \'isDone\' to false',
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  undoneTodo(
    _: null,
    params: {
      id: string,
    },
  ) {
    // const node = this.nodes.find(({ id }) => id === params.id)
    // if (!node) {
    //   return null
    // }
    // return Object.assign(node, {
    //   isDone: false,
    // })
  }

  @Mutation({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  deleteTodo(
    _: null,
    input: {
      id: string,
    },
  ) {
    // const node = this.nodes.find(({ id }) => id === input.id)
    // if (!node) {
    //   return null
    // }
    // this.nodes.splice(this.nodes.indexOf(node), 1)
    // return node
  }
}
