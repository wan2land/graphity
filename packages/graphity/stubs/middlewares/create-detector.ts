import { ConstructType, Middleware, MiddlewareCarry, MiddlewareNext } from '../../src'

export function createDetector(name: string): ConstructType<Middleware<any, any>> {
  return class {
    public async handle({ parent, args, context, info }: MiddlewareCarry<any, any>, next: MiddlewareNext<any, any>) {
      await new Promise((resolve) => setTimeout(resolve, 50)) // async
      context.stack.push(`start :: ${name} (parent=${JSON.stringify(parent || null)})`)
      const result = await next({ parent, args, context, info })
      context.stack.push(`end :: ${name} (parent=${JSON.stringify(parent || null)}, next=${JSON.stringify(result)})`)
      return result
    }
  }
}
