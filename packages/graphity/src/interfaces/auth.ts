
export interface GraphityAuth {
  user?: UserIdentifier
  roles: string[]
  [name: string]: any
}

export interface UserIdentifier {
  id: string | number
}
