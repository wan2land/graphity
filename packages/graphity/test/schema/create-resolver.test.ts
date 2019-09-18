import { GraphQLResolveInfo } from 'graphql'

import { createResolver } from '../../lib/schema/create-resolver'


describe('testsuite of schema/create-resolver', () => {
  it('test empty guards & resolve', async () => {
    const resolve = createResolver([], (parent, args, ctx: any, info) => {
      ctx.stack.push(`resolver (${JSON.stringify(parent)})`)
      return {
        success: true,
      }
    })

    const parent = {}
    const args = {}
    const ctx = { stack: [] }
    const info: GraphQLResolveInfo = {} as any

    const response = await resolve(parent, args, ctx, info)

    expect(response).not.toBe(parent)
    expect(response).toEqual({
      success: true,
    })
    expect(ctx).toEqual({
      stack: [
        'resolver ({})',
      ],
    })
  })

  it('test guards & resolve', async () => {
    const resolve = createResolver([
      async (parent, args, ctx: any, info, next) => {
        ctx.stack.push('before guard1')
        const result = await next(parent, args, ctx, info)
        ctx.stack.push(`after guard1 (${JSON.stringify(result)})`)
        return result
      },
      async (parent, args, ctx: any, info, next) => {
        ctx.stack.push('before guard2')
        const result = await next(parent, args, ctx, info)
        ctx.stack.push(`after guard2 (${JSON.stringify(result)})`)
        return result
      },
    ], (parent, args, ctx: any, info) => {
      ctx.stack.push(`resolver (${JSON.stringify(parent)})`)
      return {
        success: true,
      }
    })

    const parent = {}
    const args = {}
    const ctx = { stack: [] }
    const info: GraphQLResolveInfo = {} as any

    const response = await resolve(parent, args, ctx, info)

    expect(response).not.toBe(parent)
    expect(response).toEqual({
      success: true,
    })
    expect(ctx).toEqual({
      stack: [
        'before guard1',
        'before guard2',
        'resolver ({})',
        'after guard2 ({"success":true})',
        'after guard1 ({"success":true})',
      ],
    })
  })
})
