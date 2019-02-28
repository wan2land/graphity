const { ApolloServer } = require("apollo-server")
const { create } = require("graphity")

async function main() {
  const schema = await create({
    resolvers: [
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
