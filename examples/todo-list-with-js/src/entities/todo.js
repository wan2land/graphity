const { Field, GraphQLEntity } = require("graphity")
const { GraphQLID, GraphQLString } = require("graphql")

class Todo {
  constructor(id, contents) {
    this.id = id
    this.contents = contents || null
  }
}

GraphQLEntity()(Todo)
Field(type => GraphQLID)(Todo.prototype, "id")
Field(type => GraphQLString)(Todo.prototype, "contents")

module.exports.Todo = Todo
