import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql"

import { GraphQLListOf, GraphQLResolver, listOf, Query } from "../../../lib"
import { User } from "../entities/user"

@GraphQLResolver(returns => User, {
  guards: [
    (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push("user resolver 1")
      return next(parent, args, ctx, info)
    },
    (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push("user resolver 2")
      return next(parent, args, ctx, info)
    },
  ]
})
export class UserResolver {

  @Query({
    input: {
      id: {type: GraphQLNonNull(GraphQLID)},
    },
    guards: (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push("user resolver - user")
      return next(parent, args, ctx, info)
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
    guards: [
      (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push("user resolver - users 1")
        return next(parent, args, ctx, info)
      },
      (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push("user resolver - users 2")
        return next(parent, args, ctx, info)
      },
    ],
    returns: user => GraphQLNonNull(GraphQLListOf(user as GraphQLObjectType)),
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
