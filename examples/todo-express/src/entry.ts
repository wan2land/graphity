import { ApolloServer } from 'apollo-server'

import { Graphity } from 'graphity'
import { TodoResolver } from './resolvers/todo-resolver'

const PORT = process.env.PORT || '8888'

;(async () => {
  const app = new Graphity({
    resolvers: [
      TodoResolver,
    ],
  })

  const server = new ApolloServer({
    schema: app.createSchema(),
    context: ({ req }) => app.createContext(req),
  })

  server.listen(+PORT)

  console.log(`listen on ${PORT} 🚀`)
})()
