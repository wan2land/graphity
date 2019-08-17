import { QueryStatement } from '../interfaces/query'

export class QueryFragment implements QueryStatement {
  public constructor(
    public literals: string[],
    public placeholders: any[],
  ) {
  }

  public append(stmt: QueryFragment | string) {
    if (stmt instanceof QueryFragment) {
      this.literals[this.literals.length - 1] += stmt.literals[0]
      this.literals.push.apply(this.literals, stmt.literals.slice(1))
      stmt.placeholders.map(placeholder => this.placeholders.push(placeholder))
    } else if (typeof stmt === 'string') {
      this.literals[this.literals.length - 1] += stmt
    }
    return this
  }
}
