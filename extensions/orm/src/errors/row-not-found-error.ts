
export class RowNotFoundError extends Error {
  public constructor(message = 'row not found.') {
    super(message)
    this.name = 'RowNotFoundError'
  }
}
