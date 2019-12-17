/* eslint-disable max-classes-per-file */
import { SharedContainer } from '@graphity/container'
import { GraphQLResolveInfo } from 'graphql'

import { Middleware, MiddlewareCarry, MiddlewareNext } from '../interfaces/graphity'
import { createResolver } from './create-resolver'

class TestResolver {
  public resolve(parent: any, args: {}, ctx: any) {
    ctx.stack.push(`resolver (${JSON.stringify(parent)})`)
    return {
      success: true,
    }
  }
}

class TestMiddleware1 implements Middleware {
  public async handle({ parent, args, context, info }: MiddlewareCarry<any, any>, next: MiddlewareNext<any, any>) {
    context.stack.push('before middleware1')
    const result = await next({ parent, args, context, info })
    context.stack.push(`after middleware1 (${JSON.stringify(result)})`)
    return result
  }
}

class TestMiddleware2 implements Middleware {
  public async handle({ parent, args, context, info }: MiddlewareCarry<any, any>, next: MiddlewareNext<any, any>) {
    context.stack.push('before middleware2')
    const result = await next({ parent, args, context, info })
    context.stack.push(`after middleware2 (${JSON.stringify(result)})`)
    return result
  }
}

describe('testsuite of schema/create-resolver', () => {
  it('test empty middlewares & resolve', async () => {
    const container = new SharedContainer()
    container.instance(TestResolver, new TestResolver())

    const resolve = createResolver(container, [], TestResolver, TestResolver.prototype.resolve)

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
    const container = new SharedContainer()
    container.instance(TestResolver, new TestResolver())
    container.instance(TestMiddleware1, new TestMiddleware1())
    container.instance(TestMiddleware2, new TestMiddleware2())

    const resolve = createResolver(container, [
      TestMiddleware1,
      TestMiddleware2,
    ], TestResolver, TestResolver.prototype.resolve)

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
        'before middleware1',
        'before middleware2',
        'resolver ({})',
        'after middleware2 ({"success":true})',
        'after middleware1 ({"success":true})',
      ],
    })
  })
})
