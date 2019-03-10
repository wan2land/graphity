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
    return listOf([...this.repo.values()].sort((a, b) => {
      if (a.id === b.id) {
        return 0
      }
      return +a.id < +b.id ? 1 : -1
    }))
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
  public createTodo(parent: null, input: {contents?: string | null}) {
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
  public updateTodo(parent: null, input: {id: string, contents?: string | null}) {
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
    description: "change 'isDone' to true",
  })
  public doneTodo(parent: null, input: {id: string}) {
    const todo = this.repo.get(input.id)
    if (!todo) {
      return null
    }
    todo.isDone = true
    return todo
  }

  @Mutation({
    input: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    description: "change 'isDone' to false",
  })
  public undoneTodo(parent: null, input: {id: string}) {
    const todo = this.repo.get(input.id)
    if (!todo) {
      return null
    }
    todo.isDone = false
    return todo
  }

  @Mutation({
    input: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
  })
  public deleteTodo(parent: null, input: {id: string}) {
    const todo = this.repo.get(input.id)
    if (!todo) {
      return null
    }
    this.repo.delete(input.id)
    return todo
  }
}
