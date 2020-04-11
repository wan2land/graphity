import { ApolloServer } from 'apollo-server-lambda'
import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda'
import { Graphity } from 'graphity'

import { eventToHttpRequest } from './event-to-http-request'

export class ServerLambda {

  public apolloHandlerPromise: Promise<APIGatewayProxyHandler> | null = null

  public constructor(public graphity: Graphity) {
  }

  public execute(event: APIGatewayProxyEvent, context: Context, callback: APIGatewayProxyCallback): void {
    if (!this.apolloHandlerPromise) {
      this.apolloHandlerPromise = new Promise((resolve) => {
        this.graphity.boot().then(() => {
          const apollo = new ApolloServer({
            schema: this.graphity.createSchema(),
            context: ({ event }: { event: APIGatewayProxyEvent}) => this.graphity.createContext(eventToHttpRequest(event)),
          })
          resolve(apollo.createHandler())
        })
      })
    }
    this.apolloHandlerPromise.then((handler) => { handler(event, context, callback) })
  }
}
