const {
  GraphQLListOf,
  GraphQLResolver,
  listOf,
  Mutation,
  Query
} = require("graphity")
const { GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql")
const uuid = require("uuid")
const { Todo } = require("../entities/todo")

class TodoResolver {

  constructor() {
    this.repo = new Map()
  }

  todos() {
    return listOf([...this.repo.values()])
  }

  todo(parent, input) {
    return this.repo.get(input.id)
  }

  async createTodo(parent, input) {
    const id = uuid()
    const todo = new Todo(id, input.contents)
    this.repo.set(id, todo)
    return todo
  }

  async updateTodo(parent, input) {
    const todo = this.repo.get(input.id)
    if (!todo) {
      return null
    }
    if (typeof input.contents !== "undefined") {
      todo.contents = input.contents
    }
    return todo
  }

  async deleteTodo(parent, input) {
    const todo = this.repo.get(input.id)
    if (!todo) {
      return null
    }
    this.repo.delete(input.id)
    return todo
  }
}

GraphQLResolver(type => Todo)(TodoResolver)
Query({
  returns: todo => GraphQLListOf(todo),
})(TodoResolver.prototype, "todos")
Query({
  input: {
    id: {type: GraphQLID},
  },
})(TodoResolver.prototype, "todo")
Mutation({
  input: {
    contents: {
      type: GraphQLString,
    },
  },
})(TodoResolver.prototype, "createTodo")
Mutation({
  input: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    contents: {
      type: GraphQLString,
    },
  },
})(TodoResolver.prototype, "updateTodo")
Mutation({
  input: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})(TodoResolver.prototype, "deleteTodo")

module.exports.TodoResolver = TodoResolver
