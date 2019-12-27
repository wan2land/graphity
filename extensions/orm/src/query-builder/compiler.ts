import {
  CompileResult,
  CompileStates,
  InsertState,
  LimitState,
  OrderByState,
  SelectState,
  UpdateState,
  WhereState,
} from '../interfaces/query-builder'


export class Compiler {
  public compile(builder: CompileStates): CompileResult {
    const sqls = []
    const bindings = []
    switch (builder.method) {
      case 'select': {
        const next = this.selectState(builder.table, builder.selectState)
        sqls.push(next[0])
        bindings.push(...next[1])
        break
      }
      case 'update': {
        const next = this.updateState(builder.table, builder.updateState)
        sqls.push(next[0])
        bindings.push(...next[1])
        break
      }
      case 'insert': {
        const next = this.insertState(builder.table, builder.insertState)
        sqls.push(next[0])
        bindings.push(...next[1])
        break
      }
      case 'delete': {
        const next = this.deleteState(builder.table)
        sqls.push(next[0])
        bindings.push(...next[1])
        break
      }
    }
    if (builder.whereStates) {
      const next = this.whereStates(builder.whereStates)
      if (next) {
        sqls.push(`where ${next[0]}`)
        bindings.push(...next[1])
      }
    }
    if (builder.orderByStates) {
      const next = this.orderByStates(builder.orderByStates)
      if (next) {
        sqls.push(`order by ${next[0]}`)
        bindings.push(...next[1])
      }
    }
    if (builder.limitState) {
      const next = this.limitState(builder.limitState)
      if (next) {
        sqls.push(next[0])
        bindings.push(...next[1])
      }
    }
    return { sql: sqls.join(' '), bindings }
  }

  public selectState(table: string, state?: SelectState): [string, any[]] {
    if (state && state.columns) {
      return [`select ${state.columns.map(column => this.normalizeColumnName(column)).join(',')} from ${this.normalizeTableName(table)}`, []]
    }
    return [`select * from ${this.normalizeTableName(table)}`, []]
  }

  public deleteState(table: string): [string, any[]] {
    return [`delete from ${this.normalizeTableName(table)}`, []]
  }

  public updateState(table: string, state?: UpdateState): [string, any[]] {
    if (state && state.value) {
      const keys = Object.keys(state.value)
      return [
        `update ${this.normalizeTableName(table)} set ${keys.map(key => `${this.normalizeColumnName(key)} = ?`).join(', ')}`,
        keys.map(key => state.value[key] !== null && typeof state.value[key] !== 'undefined' ? state.value[key] : null),
      ]
    }
    return [`update ${this.normalizeTableName(table)}`, []]
  }

  public insertState(table: string, state?: InsertState): [string, any[]] {
    if (state && state.values && state.values.length > 0) {
      const keys = [
        ...state.values.reduce<Set<string>>((carry, value) => {
          Object.keys(value).forEach(key => carry.add(key))
          return carry
        }, new Set()),
      ]
      const keysFrag = keys.map(key => `${this.normalizeColumnName(key)}`).join(', ')
      const valueFrag = `(?${', ?'.repeat(keys.length - 1)})`
      const valuesFrag = `${valueFrag}${`, ${valueFrag}`.repeat(state.values.length - 1)}`
      const bindings = state.values.reduce<any[]>((carry, value) => {
        carry.push(...keys.map(key => value[key] !== null && typeof value[key] !== 'undefined' ? value[key] : null))
        return carry
      }, [])
      return [`insert into ${this.normalizeTableName(table)}(${keysFrag}) values ${valuesFrag}`, bindings]
    }
    return [`insert into ${this.normalizeTableName(table)}`, []]
  }

  public whereStates(states: WhereState[]): [string, any[]] | null {
    if (states.length === 0) {
      return null
    }
    let sql = ''
    const bindings: any[] = []
    states.forEach((state, stateIndex) => {
      const [stateSql, stateBindings] = this.whereState(state)
      sql += stateIndex === 0 ? stateSql : ` ${state.or ? 'or' : 'and'} ${stateSql}`
      bindings.push(...stateBindings)
    })
    return [sql, bindings]
  }

  public whereState(state: WhereState): [string, any[]] {
    switch (state.operator) {
      case 'is null': {
        if (state.not) {
          return [`${this.normalizeColumnName(state.name)} is not null`, []]
        }
        return [`${this.normalizeColumnName(state.name)} is null`, []]
      }
      case 'in': {
        if (state.not) {
          if (!state.value || state.value.length === 0) {
            return ['1 = 1', []]
          }
          return [
            `${this.normalizeColumnName(state.name)} not ${state.operator} (?${', ?'.repeat(state.value.length - 1)})`,
            state.value || [],
          ]
        }
        if (!state.value || state.value.length === 0) {
          return ['1 = 2', []]
        }
        return [
          `${this.normalizeColumnName(state.name)} ${state.operator} (?${', ?'.repeat(state.value.length - 1)})`,
          state.value || [],
        ]
      }
    }
    return [
      `${this.normalizeColumnName(state.name)} ${state.operator} ?`,
      state.value || [],
    ]
  }

  public orderByStates(states: OrderByState[]): [string, any[]] | null {
    if (states.length === 0) {
      return null
    }
    const sqls: string[] = []
    states.forEach((state) => {
      sqls.push(state.desc ? `${this.normalizeColumnName(state.name)} desc` : `${this.normalizeColumnName(state.name)}`)
    })
    return [sqls.join(', '), []]
  }

  public limitState(state: LimitState): [string, any[]] | null {
    if (state.take !== null && typeof state.take !== 'undefined' && state.offset !== null && typeof state.offset !== 'undefined') {
      return ['limit ?, ?', [state.offset, state.take]]
    }
    if (state.take !== null && typeof state.take !== 'undefined') {
      return ['limit ?', [state.take]]
    }
    if (state.offset !== null && typeof state.offset !== 'undefined') {
      return ['offset ?', [state.offset]]
    }
    return null
  }

  public normalizeTableName(name: string) {
    return name
  }

  public normalizeColumnName(name: string) {
    return name
  }
}
