import { UserIdentifier, UserProvider } from '../interfaces/auth'


export class DefaultUserProvider implements UserProvider {
  public findUser(id: string | number): Promise<UserIdentifier | undefined> {
    return Promise.resolve({ id })
  }

  public getRoles(user?: UserIdentifier): string[] {
    if (user) {
      return ['user']
    }
    return []
  }
}
