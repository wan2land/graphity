import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { GraphQLListOf, GraphQLResolver, listOf, Query } from '../../../lib'
import { User } from '../entities/user'

@GraphQLResolver(returns => User, {
  guards: [
    async (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push('before user resolver1')
      const result = await next(parent, args, ctx, info)
      ctx.stack.push(`after user resolver1 (${JSON.stringify(result)})`)
      return result
    },
    async (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push('before user resolver2')
      const result = await next(parent, args, ctx, info)
      ctx.stack.push(`after user resolver2 (${JSON.stringify(result)})`)
      return result
    },
  ],
})
export class UserResolver {

  @Query({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
    guards: async (parent, args, ctx, info, next) => {
      ctx.stack = ctx.stack || []
      ctx.stack.push('before user resolver - user')
      const result = await next(parent, args, ctx, info)
      ctx.stack.push(`after user resolver - user (${JSON.stringify(result)})`)
      return result
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
      async (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push('before user resolver - users1')
        const result = await next(parent, args, ctx, info)
        ctx.stack.push(`after user resolver - users1 (${JSON.stringify(result)})`)
        return result
      },
      async (parent, args, ctx, info, next) => {
        ctx.stack = ctx.stack || []
        ctx.stack.push('before user resolver - users2')
        const result = await next(parent, args, ctx, info)
        ctx.stack.push(`after user resolver - users2 (${JSON.stringify(result)})`)
        return result
      },
    ],
    returns: user => GraphQLNonNull(GraphQLListOf(user as GraphQLObjectType)),
  })
  public async users(parent: User | null) {
    return listOf([
      Object.assign(new User(), {
        id: parent ? `${parent.id}_1` : '1',
        name: `name is ${parent ? `${parent.id}_1` : '1'}`,
      }),
      Object.assign(new User(), {
        id: parent ? `${parent.id}_2` : '2',
        name: `name is ${parent ? `${parent.id}_2` : '2'}`,
      }),
    ])
  }
}
