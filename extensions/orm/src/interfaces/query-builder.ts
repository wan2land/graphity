
export type QueryMethod = 'select' | 'update' | 'insert' | 'delete'

export type WhereOperator = '=' | '!=' | '>' | '<' | '<=' | '>=' | 'like' | 'in' | 'is null' | 'between'

export type WhereValue = string | number | boolean

export interface SelectState {
  columns?: string[]
}

export interface UpdateState {
  value: { [name: string]: any }
}

export interface InsertState {
  values: { [name: string]: any }[]
}

export interface WhereState {
  or?: boolean
  not?: boolean
  name: string
  operator: WhereOperator
  value?: WhereValue[]
  children?: WhereState[] // next states
}

export interface OrderByState {
  name: string
  desc?: boolean
}

export interface LimitState {
  take?: number
  offset?: number
}

export interface CompileStates {
  table: string
  method: QueryMethod

  selectState?: SelectState
  updateState?: UpdateState
  insertState?: InsertState

  whereStates?: WhereState[]
  orderByStates?: OrderByState[]
  limitState?: LimitState
}

export interface CompileResult {
  sql: string
  bindings: any[]
}
