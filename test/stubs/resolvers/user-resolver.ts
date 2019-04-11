import { GraphQLID, GraphQLNonNull } from "graphql"

import { GraphQLListOf, GraphQLResolver, listOf, Query } from "../../../lib"
import { User } from "../entities/user"

@GraphQLResolver(returns => User)
export class UserResolver {

  @Query({
    input: {
      id: {type: GraphQLNonNull(GraphQLID)},
    },
  })
  public async user(parent: null, input: {id: string}) {
    return Object.assign(new User(), {
      id: `${input.id}`,
      name: `name is ${input.id}`,
    })
  }

  @Query({
    parent: type => User,
    returns: user => GraphQLNonNull(GraphQLListOf(user)),
  })
  public async users(parent: User | null) {
    return listOf([
      Object.assign(new User(), {
        id: parent ? `${parent.id}_1` : "1",
        name: `name is ${parent ? `${parent.id}_1` : "1"}`,
      }),
      Object.assign(new User(), {
        id: parent ? `${parent.id}_2` : "2",
        name: `name is ${parent ? `${parent.id}_2` : "2"}`,
      }),
    ])
  }
}
