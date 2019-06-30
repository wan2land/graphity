import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"

import { Field, GraphQLEntity } from "../../../lib"

@GraphQLEntity()
export class User {
  @Field(type => GraphQLNonNull(GraphQLID), {
    guards: (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push("user entity - id")
      return next(parent, args, ctx, info)
    },
  })
  public id!: string

  @Field(type => GraphQLNonNull(GraphQLString), {
    guards: [
      (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push("user entity - name 1")
        return next(parent, args, ctx, info)
      },
      (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push("user entity - name 2")
        return next(parent, args, ctx, info)
      },
    ],
  })
  public name!: string
}
