import { Provider, ProviderDescriptor } from '@graphity/container'

import { DefaultUserProvider } from '../auth/default-user-provider'
import { Jwt } from '../auth/jwt'
import { JwtAuthBuilder } from '../auth/jwt-auth-builder'
import { InstanceName } from '../constants/container'
import { UserProvider } from '../interfaces/auth'
import { JwtOptions } from '../interfaces/jwt'

export class AuthProvider implements Provider {
  public constructor(public options: { jwt: JwtOptions }) {
  }

  public register(app: ProviderDescriptor) {
    app.resolver(Jwt, () => new Jwt(this.options.jwt))
    app.resolver(InstanceName.AuthBuilder, async () => {
      return new JwtAuthBuilder(
        await app.resolve(Jwt),
        await app.resolve<UserProvider>(InstanceName.UserProvider),
      )
    })
    app.resolver(InstanceName.UserProvider, () => new DefaultUserProvider())
  }
}
