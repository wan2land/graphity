import { ApolloServer } from "apollo-server"
import { createSchema } from "graphity"
import { TodoResolver } from "./resolvers/todo-resolver"

async function main() {
  const server = new ApolloServer({
    schema: createSchema([
      TodoResolver,
    ]),
  })

  server.listen(8888)

  console.log("listen on 8888")
}

main()
