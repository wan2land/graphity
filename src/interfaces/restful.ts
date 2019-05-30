import { DocumentNode } from "graphql"
import { IncomingMessage } from "http"

import { MaybePromise } from "./utils"


export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export interface GraphQLQuery {
  document: DocumentNode
  values?: {[key: string]: any}
}

export interface HttpEndPoint<R = IncomingMessage> {
  method: HttpMethod
  path: string
  query(request: R): MaybePromise<GraphQLQuery>
}

export interface CreateOptions<R> {
  endpoints: HttpEndPoint<R>[]
  rootValue?: any
  context?: (request: R) => any
}
