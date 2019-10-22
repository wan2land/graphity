import { GraphQLResolver, Query } from '../../src'


const pkg = require('../../package.json') // eslint-disable-line @typescript-eslint/no-require-imports

@GraphQLResolver()
export class HomeResolver {

  @Query()
  public version() {
    return pkg.version
  }
}
