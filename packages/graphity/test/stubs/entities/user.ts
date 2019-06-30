import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql"

import { Field, GraphQLEntity } from "../../../lib"

@GraphQLEntity()
export class User {
  @Field(type => GraphQLNonNull(GraphQLID), {
    guards: (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push(`before user field - id`)
      const result = next(parent, args, ctx, info)
      ctx.stack.push(`after user field - id (${JSON.stringify(result)})`)
      return result
    },
  })
  public id!: string

  @Field(type => GraphQLNonNull(GraphQLString), {
    guards: [
      (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push(`before user field - name1`)
        const result = next(parent, args, ctx, info)
        ctx.stack.push(`after user field - name1 (${JSON.stringify(result)})`)
        return result
      },
      (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push(`before user field - name2`)
        const result = next(parent, args, ctx, info)
        ctx.stack.push(`after user field - name2 (${JSON.stringify(result)})`)
        return result
      },
    ],
  })
  public name!: string
}
