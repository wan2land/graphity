import {
  GraphQLListOf,
  GraphQLResolver,
  listOf,
  Mutation,
  Query
  } from "graphity"
import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"
import { Todo } from "../entities/todo"

let increment = 1

@GraphQLResolver(type => Todo)
export class TodoResolver {

  public repo = new Map<string, Todo>()

  @Query({
    returns: todo => GraphQLListOf(todo),
  })
  public todos() {
    return listOf([...this.repo.values()])
  }

  @Query({
    input: {
      id: {type: GraphQLID},
    },
  })
  public todo(parent: null, input: {id: string}) {
    return this.repo.get(input.id)
  }

  @Mutation({
    input: {
      contents: {
        type: GraphQLString,
      },
    },
  })
  public async createTodo(parent: null, input: {contents?: string | null}) {
    const id = increment++
    const todo = Object.assign(new Todo(), {
      id: `${id}`,
      contents: input.contents,
    })
    this.repo.set(`${id}`, todo)
    return todo
  }

  @Mutation({
    input: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
      contents: {
        type: GraphQLString,
      },
    },
  })
  public async updateTodo(parent: null, input: {id: string, contents?: string | null}) {
    const todo = this.repo.get(input.id)
    if (!todo) {
      return null
    }
    if (typeof input.contents !== "undefined") {
      todo.contents = input.contents
    }
    return todo
  }

  @Mutation({
    input: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
  })
  public async deleteTodo(parent: null, input: {id: string}) {
    const todo = this.repo.get(input.id)
    if (!todo) {
      return null
    }
    this.repo.delete(input.id)
    return todo
  }
}
