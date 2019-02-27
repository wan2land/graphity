import { ApolloServer } from "apollo-server"
import { create } from "graphity"

async function main() {
  const schema = await create({
    resolvers: [
      __dirname + "/resolvers/**/*.ts",
      __dirname + "/resolvers/**/*.js",
    ],
  })
  const server = new ApolloServer({
    schema,
  })
  server.listen(8888)
  console.log("listen on 8888")
}

main()
