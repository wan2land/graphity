import { ApolloServer } from 'apollo-server-express'
import express, { Express } from 'express'
import { Graphity } from 'graphity'
import portfinder from 'portfinder'

import { reqToHttpRequest } from './req-to-http-request'

export class ServerExpress {
  public app: Express

  public constructor(public graphity: Graphity, app?: Express) {
    this.app = app ?? express()
  }

  public start(port = 8000, host?: string): Promise<{ apollo: ApolloServer, host: string, port: number }> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.graphity.boot(),
        portfinder.getPortPromise({ port, host }),
      ]).then(([_, startPort]) => {
        const apollo = new ApolloServer({
          schema: this.graphity.createSchema(),
          context: ({ req }) => this.graphity.createContext(reqToHttpRequest(req)),
        })
        apollo.applyMiddleware({ app: this.app })

        this.app.listen(startPort, () => {
          console.log(`🚀 Start Graphity on ${host || 'localhost'}:${startPort}`)
          resolve({
            apollo,
            host: host || 'localhost',
            port: startPort,
          })
        })
      }).catch(reject)
    })
  }
}
