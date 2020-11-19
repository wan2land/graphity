import { Container } from '@graphity/container'

import { InstanceName } from '../constants/container'
import { AuthBuilder } from '../interfaces/auth'
import { GraphityContext } from '../interfaces/graphity'
import { ContextBuilder, HttpRequest } from '../interfaces/graphql'

export class GraphityContextBuilder implements ContextBuilder<GraphityContext> {

  constructor(public container: Container) {
  }

  buildContext(request: HttpRequest): Promise<GraphityContext> {
    if (this.container.has(InstanceName.AuthBuilder)) {
      return this.container.get<AuthBuilder>(InstanceName.AuthBuilder).buildAuth(request).then(auth => ({
        $request: request,
        $container: this.container,
        $auth: auth,
      }))
    }
    return Promise.resolve({
      $request: request,
      $container: this.container,
    })
  }
}
