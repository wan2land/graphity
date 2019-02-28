import { ApolloServer } from "apollo-server-lambda"
import {
  APIGatewayEvent,
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  Context
  } from "aws-lambda"
import { createGraphQLSchema } from "graphity"
import { TodoResolver } from "./resolvers/todo-resolver"

const glob = require("glob")

export async function home(event: APIGatewayEvent) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      version: "1.0.0",
      files: await new Promise((resolve, reject) => {
        glob(__dirname + "/**/*", (err: any, files: string[]) => {
          if (err) {
            return reject(err)
          }
          resolve(files)
        })
      }),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }
}

let handler: (event: APIGatewayProxyEvent, context: Context, callback: APIGatewayProxyCallback) => void
export async function graphql(event: APIGatewayEvent, ctx: Context) {
  if (!handler) {
    const server = new ApolloServer({
      schema: await createGraphQLSchema([
        TodoResolver,
      ]),
      playground: {
        endpoint: "/dev/graphql",
      },
    })
    handler = server.createHandler()
  }
  return await new Promise((resolve, reject) => {
    handler(event, ctx, (error, data) => {
      return error ? reject(error) : resolve(data)
    })
  })
}
