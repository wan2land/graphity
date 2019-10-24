import { HttpRequest } from './graphity'

export interface JwtUser {
  id: string | number
}

export interface GraphQLAuthContext<TAuthUser = any, TAuthRole = string> {
  request: HttpRequest
  auth: {
    user?: TAuthUser,
    roles: TAuthRole[],
  }
}
