import { GraphityAuth, UserIdentifier } from '../interfaces/auth'

export interface CreateTokenOptions<TRole extends string> {
  expiresIn?: number
  role?: TRole | TRole[]
}

export interface RefreshTokenOptions {
  expiresIn?: number
}

export class AuthBuilder<TRole extends string> {
  createAccessToken(user: UserIdentifier, options?: CreateTokenOptions<TRole>): Promise<string> {
    throw new Error('It must be implemented.')
  }

  refreshAccessToken(refreshToken: string, options?: RefreshTokenOptions): Promise<string> {
    throw new Error('It must be implemented.')
  }

  createRefreshToken(user: UserIdentifier, options?: CreateTokenOptions<TRole>): Promise<string> {
    throw new Error('It must be implemented.')
  }

  buildAuth(accessToken: string | null): Promise<GraphityAuth> {
    throw new Error('It must be implemented.')
  }
}
