import { GraphQLResolver, Query } from '../../../lib'


const pkg = require('../../../package.json') // eslint-disable-line @typescript-eslint/no-require-imports

@GraphQLResolver()
export class HomeResolver {

  @Query()
  public async version(parent: null, input: {id: string}) {
    return pkg.version
  }
}
