import { GraphQLResolver, Query } from "../../../lib"


const pkg = require("../../../package.json")

@GraphQLResolver()
export class HomeResolver {

  @Query()
  public async version(parent: null, input: {id: string}) {
    return pkg.version
  }
}
