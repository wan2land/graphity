import { Middleware } from '../../src'

export class Nothing implements Middleware<any, any> {
  public handle(_: {}, next: any) {
    return next()
  }
}
