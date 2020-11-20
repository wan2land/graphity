import { Container } from '@graphity/container'

import { InstanceName } from '../constants/container'
import { AuthBuilder } from '../interfaces/auth'
import { GraphityContext } from '../interfaces/graphity'
import { HttpRequest } from '../interfaces/graphql'
import { BaseContextBuilder } from './base-context-builder'

export class GraphityContextBuilder extends BaseContextBuilder<GraphityContext> {

  constructor(public container: Container) {
    super()
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
