import { Container } from '@graphity/container'

import { GraphityAuth } from './auth'
import { HttpRequest } from './graphql'

export interface GraphityContext {
  $request: HttpRequest
  $container: Container
  $auth?: GraphityAuth
}
