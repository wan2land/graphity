
export interface GraphityAuth {
  user: UserIdentifier
  roles: string[]
  [name: string]: any
}

export interface UserIdentifier {
  id: string | number
}

export interface UserProvider {
  findUser(id: string | number): Promise<UserIdentifier | undefined>
  getRoles(user?: UserIdentifier): string[]
}
