import { GraphityError } from './graphity-error'

describe('testsuite of errors/graphity-error', () => {
  it('test create error', () => {
    expect(new GraphityError('error on tests').name).toEqual('GraphityError')
    expect(new GraphityError('error on tests') instanceof GraphityError)
  })

  it('test error occured', () => {
    try {
      throw new GraphityError('error on tests')
    } catch (e) {
      expect(e).toBeInstanceOf(GraphityError)
      expect(e.name).toEqual('GraphityError')
    }
  })
})
