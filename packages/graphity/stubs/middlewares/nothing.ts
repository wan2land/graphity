import { Middleware } from '../../src'

export class Nothing implements Middleware {
  public handle(_: {}, next: any) {
    return next()
  }
}
