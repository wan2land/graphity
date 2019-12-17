"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.home = home;
exports.graphql = graphql;

var _apolloServerLambda = require("apollo-server-lambda");

var _graphity = require("../../../packages/graphity");

var _todoResolver = require("./resolvers/todo-resolver");

async function home(event) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      version: "1.0.0"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
}

const server = new _apolloServerLambda.ApolloServer({
  schema: (0, _graphity.createSchema)([_todoResolver.TodoResolver]),
  playground: {
    endpoint: "/dev/graphql"
  }
});
const handler = server.createHandler();

async function graphql(event, ctx) {
  return await new Promise((resolve, reject) => {
    handler(event, ctx, (error, data) => {
      return error ? reject(error) : resolve(data);
    });
  });
}