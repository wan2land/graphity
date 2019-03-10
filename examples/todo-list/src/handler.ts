import { ApolloServer } from "apollo-server-lambda"
import { APIGatewayEvent, Context } from "aws-lambda"
import { createSchema } from "graphity"
import { TodoResolver } from "./resolvers/todo-resolver"

export async function home(event: APIGatewayEvent) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      version: "1.0.0",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }
}

const server = new ApolloServer({
  schema: createSchema([
    TodoResolver,
  ]),
  playground: {
    endpoint: "/dev/graphql",
  },
})
const handler = server.createHandler()

export async function graphql(event: APIGatewayEvent, ctx: Context) {
  return await new Promise((resolve, reject) => {
    handler(event, ctx, (error, data) => {
      return error ? reject(error) : resolve(data)
    })
  })
}
