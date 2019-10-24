import { Container, Provider } from 'graphity'

import { JwtOptions } from '../interfaces/jwt'
import { Jwt } from '../jwt/jwt'

export class JwtProvider implements Provider {
  public constructor(public options: { jwt: JwtOptions }) {
  }

  public register(container: Container) {
    container.resolver(Jwt, () => new Jwt(this.options.jwt))
  }
}
