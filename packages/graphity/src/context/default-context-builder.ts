import { Container } from '@graphity/container'

import { ContextBuilder, GraphityContext, HttpRequest, AuthBuilder } from '../interfaces/graphity'

export class DefaultContextBuilder implements ContextBuilder<GraphityContext> {

  public constructor(public container: Container) {
  }

  public buildContext(request: HttpRequest): Promise<GraphityContext> {
    if (this.container.has('graphity:authBuilder')) {
      return Promise.resolve(this.container.get<AuthBuilder>('graphity:authBuilder').buildAuth(request))
        .then(auth => Promise.resolve({
          request,
          container: this.container,
          auth,
        }))
    }
    return Promise.resolve({
      request,
      container: this.container,
    })
  }
}
