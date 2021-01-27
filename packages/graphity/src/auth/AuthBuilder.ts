import { GraphityAuth, UserIdentifier } from '../interfaces/auth'


export abstract class AuthBuilder {
  abstract createToken (user: UserIdentifier): string
  abstract buildAuth (accessToken: string | null): Promise<GraphityAuth>
}
