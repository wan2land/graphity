import { ApolloServer } from 'apollo-server-express'
import express, { Express } from 'express'
import { Graphity, ContextBuilder } from 'graphity'
import { subscribe, execute } from 'graphql'
import { createServer, Server } from 'http'
import portfinder from 'portfinder'

import { reqToHttpRequest } from './req-to-http-request'

export class ServerExpress {
  app: Express

  constructor(
    public graphity: Graphity,
    app?: Express
  ) {
    this.app = app ?? express()
  }

  async start(port = 8000, host?: string): Promise<{ apollo: ApolloServer, host: string, port: number }> {
    return Promise.all([
      portfinder.getPortPromise({ port, host }),
      this.graphity.boot(),
    ]).then(([startPort]) => {
      const contextBuilder = this.graphity.getContextBuilder()
      const schema = this.graphity.createSchema()
      const apollo = new ApolloServer({
        schema,
        context: (context) => contextBuilder.buildHttpContext(reqToHttpRequest(context.req), context),
      })
      apollo.applyMiddleware({ app: this.app })

      let serverPromise: Promise<Express | Server> = Promise.resolve(this.app)
      if (schema.getSubscriptionType()) {
        serverPromise = import('subscriptions-transport-ws').then(({ SubscriptionServer }) => {
          const server = createServer(this.app)
          SubscriptionServer.create({
            schema,
            subscribe,
            execute,
            onOperation: (_: any, connection: any, websocket: any) => {
              return contextBuilder.buildWsContext(reqToHttpRequest(websocket.upgradeReq), websocket).then(context => ({
                ...connection,
                context,
              }))
            },
          }, {
            server,
            path: '/graphql',
          })
          return server
        })
      }

      return serverPromise.then((server) => new Promise((resolve) => server.listen(startPort, () => {
        console.log(`🚀 Start Graphity on ${host ?? 'localhost'}:${startPort}`)
        resolve({
          apollo,
          host: host ?? 'localhost',
          port: startPort,
        })
      })))
    })
  }
}
