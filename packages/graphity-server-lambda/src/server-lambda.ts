import { ApolloServer } from 'apollo-server-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
import { Graphity } from 'graphity'

export class ServerLambda {

  public apolloHandlerPromise: Promise<APIGatewayProxyHandler> | null = null

  public constructor(public graphity: Graphity) {
  }

  public execute: APIGatewayProxyHandler = function (this: ServerLambda, event, context, callback) {
    if (!this.apolloHandlerPromise) {
      this.apolloHandlerPromise = new Promise((resolve) => {
        this.graphity.boot().then(() => {
          const apollo = new ApolloServer({
            schema: this.graphity.createSchema(),
            context: ({ req }) => this.graphity.createContext(req),
          })
          resolve(apollo.createHandler())
        })
      })
    }
    this.apolloHandlerPromise.then((handler) => { handler(event, context, callback) })
  }
}
