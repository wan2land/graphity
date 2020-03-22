import { ApolloServer } from 'apollo-server-express'
import express, { Express } from 'express'
import { Graphity } from 'graphity'
import portfinder from 'portfinder'

export class ServerExpress {
  public apollo: ApolloServer
  public app: Express

  public constructor(public graphity: Graphity, app?: Express) {
    this.apollo = new ApolloServer({
      schema: graphity.createSchema(),
      context: ({ req }) => graphity.createContext(req),
    })
    this.app = app ?? express()
    this.apollo.applyMiddleware({ app: this.app })
  }

  public start(port: number = 8000, host?: string): Promise<{ host: string, port: number }> {
    return new Promise((resolve, reject) => {
      portfinder.getPort({ port, host }, (err, startPort) => {
        if (err) {
          return reject(err)
        }
        this.app.listen(startPort, () => {
          console.log(`🚀 Start Graphity on ${host || 'localhost'}:${startPort}`)
          resolve({
            host: host || 'localhost',
            port: startPort,
          })
        })
      })
    })
  }
}
