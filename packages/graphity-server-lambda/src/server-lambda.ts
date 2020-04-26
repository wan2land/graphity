import { ApolloServer } from 'apollo-server-lambda'
import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda'
import { Graphity } from 'graphity'

import { eventToHttpRequest } from './event-to-http-request'

export interface ServerLambdaOptions {
  callbackWaitsForEmptyEventLoop?: boolean
  cors?: {
    origin?: boolean | string | string[],
    methods?: string | string[],
    allowedHeaders?: string | string[],
    exposedHeaders?: string | string[],
    credentials?: boolean,
    maxAge?: number,
  }
}

export class ServerLambda {

  public apolloHandlerPromise: Promise<APIGatewayProxyHandler> | null = null

  public constructor(public graphity: Graphity, public _options: ServerLambdaOptions = {}) {
  }

  public execute(event: APIGatewayProxyEvent, context: Context, callback: APIGatewayProxyCallback): void {
    if (!this.apolloHandlerPromise) {
      this.apolloHandlerPromise = new Promise((resolve) => {
        this.graphity.boot().then(() => {
          const apollo = new ApolloServer({
            schema: this.graphity.createSchema(),
            context: ({ event }: { event: APIGatewayProxyEvent}) => this.graphity.createContext(eventToHttpRequest(event)),
          })
          resolve(apollo.createHandler({
            cors: this._options.cors,
          }))
        })
      })
    }
    if (this._options.callbackWaitsForEmptyEventLoop !== null && typeof this._options.callbackWaitsForEmptyEventLoop !== 'undefined') {
      context.callbackWaitsForEmptyEventLoop = this._options.callbackWaitsForEmptyEventLoop
    }
    this.apolloHandlerPromise.then((handler) => { handler(event, context, callback) })
  }
}
