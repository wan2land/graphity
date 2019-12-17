"use strict";

require("core-js/modules/es.promise");

var _apolloServer = require("apollo-server");

var _graphity = require("graphity");

var _todoResolver = require("./resolvers/todo-resolver");

const PORT = process.env.PORT || '8888';

(async () => {
  const app = new _graphity.Graphity({
    entries: [_todoResolver.TodoResolver]
  });
  const server = new _apolloServer.ApolloServer({
    schema: app.createSchema()
  });
  server.listen(+PORT);
  console.log(`listen on ${PORT} 🚀`);
})();