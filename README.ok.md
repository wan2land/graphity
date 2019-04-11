<p align="center">
  <img src="./logo.png" alt="graphity" width="400" />
</p>

<p align="center">GraphQL Typescript Framework</p>

<p align="center">
  <a href="https://travis-ci.org/corgidisco/graphity"><img alt="Build" src="https://img.shields.io/travis/corgidisco/graphity.svg" /></a>
  <a href="https://npmcharts.com/compare/graphity?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/graphity.svg" /></a>
  <a href="https://www.npmjs.com/package/graphity"><img alt="Version" src="https://img.shields.io/npm/v/graphity.svg" /></a>
  <a href="https://www.npmjs.com/package/graphity"><img alt="License" src="https://img.shields.io/npm/l/graphity.svg" /></a>
  <br />
  <a href="https://david-dm.org/corgidisco/graphity"><img alt="dependencies Status" src="https://david-dm.org/corgidisco/graphity/status.svg" /></a>
  <a href="https://david-dm.org/corgidisco/graphity?type=dev"><img alt="devDependencies Status" src="https://david-dm.org/corgidisco/graphity/dev-status.svg" /></a>
  <br />
  <a href="https://www.npmjs.com/package/graphity"><img alt="NPM" src="https://nodei.co/npm/graphity.png" /></a>
</p>

**Graphity** is a library that makes typescript and GraphQL easy to use. As much as possible, the object of [GraphQL.js](https://github.com/graphql/graphql-js) can be used as it is.

## How to use

### Installation

Currently, **Graphity** is only responsible for the Schema of GraphQL and can be run through [Apollo Server](https://github.com/apollographql/apollo-server).

```
npm i graphity apollo-server
npm i @types/graphql -D
```

### Typescript Confituration

set this option in `tsconfig.json` file of your project.

```json
{
  "experimentalDecorators": true
}
```

## Example

[Show Serverless Full Source](./examples/todo-list)

## Documents

Let's create a Todo list using Graphity. The minimum unit in Graphity is Entity.

@code("examples/todo-list/src/entities/todo.ts")

This entity is converted to a GraphQL Schema:

```graphql
"""todo entity"""
type Todo {
  id: ID

  """do what you want to do"""
  contents: String!
  isDone: Boolean
}
```

Now let's create a **Resolver** that returns **Todo Entity**. If you create an entire CRUD with an array without a DB:

@code("examples/todo-list/src/resolvers/todo-resolver.ts")

**Resolver** creates Query and Mutation.

```graphql
type Query {
  todos: ListOfTodo
  todo(id: ID): Todo
}

type Mutation {
  createTodo(contents: String): Todo
  updateTodo(id: ID!, contents: String): Todo

  """change 'isDone' to true"""
  doneTodo(id: ID!): Todo

  """change 'isDone' to false"""
  undoneTodo(id: ID!): Todo
  deleteTodo(id: ID!): Todo
}

type ListOfTodo {
  totalCount: Int!
  nodes: [Todo!]!
}
```

And on the server, you can do the following:

```typescript

import { ApolloServer } from "apollo-server"
import { createSchema } from "graphity"
import { TodoResolver } from "./resolvers/todo-resolver"

const server = new ApolloServer({
  schema: createSchema([
    TodoResolver,
  ]),
})
server.listen(8888)

```

## License

MIT
