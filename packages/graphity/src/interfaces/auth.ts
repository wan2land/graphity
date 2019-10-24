import { IncomingHttpHeaders } from 'http'

export interface JwtUser {
  id: string | number
}

export interface HttpRequest {
  method: string
  url?: string
  headers: IncomingHttpHeaders
}

export interface GraphQLAuthContext<TAuthUser = any, TAuthRole = string> {
  request: HttpRequest
  auth: {
    user?: TAuthUser,
    roles: TAuthRole[],
  }
}
