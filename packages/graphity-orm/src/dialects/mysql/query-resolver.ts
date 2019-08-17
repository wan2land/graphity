import { QueryStatement } from '../../interfaces/query'

export class MysqlQueryResolver {
  public resolve(stmt: QueryStatement): { query: string, bindings: any[] } {
    let query = ''
    const bindings: any[] = []
    stmt.literals.forEach((literal, index) => {
      if (index !== 0) {
        const placeholder = stmt.placeholders[index - 1]
        if (placeholder && placeholder.literals && placeholder.placeholders) {
          const next = this.resolve(placeholder)
          query += next.query
          next.bindings.forEach(binding => bindings.push(binding))
        } else {
          query += '?'
          bindings.push(placeholder === null || typeof placeholder === 'undefined' ? null : placeholder)
        }
      }
      query += literal
    })
    return {
      query,
      bindings,
    }
  }
}
