import { GraphityAuth, UserIdentifier } from '../interfaces/auth'

export interface CreateTokenOptions<TRole extends string> {
  expiresIn?: number
  role?: TRole | TRole[]
}

export class AuthBuilder<TUser extends UserIdentifier, TRole extends string> {
  createAccessToken(user: TUser, options?: CreateTokenOptions<TRole>): Promise<string> {
    throw new Error('It must be implemented.')
  }

  createRefreshToken(user: TUser, options?: CreateTokenOptions<TRole>): Promise<string> {
    throw new Error('It must be implemented.')
  }

  showRefreshToken(refreshToken: string): Promise<{ user: TUser, role?: TRole | TRole[] }> {
    throw new Error('It must be implemented.')
  }

  buildAuth(accessToken?: string | null): Promise<GraphityAuth> {
    throw new Error('It must be implemented.')
  }
}
