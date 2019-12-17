import { Container } from '@graphity/container'

import { InstanceName } from '../constants/container'
import { AuthBuilder, ContextBuilder, GraphityContext, HttpRequest } from '../interfaces/graphity'

export class DefaultContextBuilder implements ContextBuilder {

  public constructor(public container: Container) {
  }

  public buildContext(request: HttpRequest): Promise<GraphityContext> {
    if (this.container.has(InstanceName.AuthBuilder)) {
      return Promise.resolve(this.container.get<AuthBuilder>(InstanceName.AuthBuilder).buildAuth(request))
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
