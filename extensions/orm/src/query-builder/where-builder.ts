import { WhereOperator, WhereState, WhereValue } from '../interfaces/query-builder'

function isNull(value: any): value is (null | undefined) {
  return value === null || typeof value === 'undefined'
}

export class WhereBuilder {
  public whereStates?: WhereState[]

  public where(name: string, value: WhereValue): this
  public where(name: string, operator: WhereOperator, value: WhereValue): this
  public where(name: string, operatorOrValue: any, valueOrNull?: WhereValue) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      name,
      operator: !isNull(valueOrNull) ? operatorOrValue : '=',
      value: [!isNull(valueOrNull) ? valueOrNull : operatorOrValue],
    })
    return this
  }

  public orWhere(name: string, value: WhereValue): this
  public orWhere(name: string, operator: WhereOperator, value: WhereValue): this
  public orWhere(name: string, operatorOrValue: any, valueOrNull?: WhereValue) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      or: true,
      name,
      operator: !isNull(valueOrNull) ? operatorOrValue : '=',
      value: [!isNull(valueOrNull) ? valueOrNull : operatorOrValue],
    })
    return this
  }

  public whereNot(name: string, value: WhereValue): this
  public whereNot(name: string, operator: WhereOperator, value: WhereValue): this
  public whereNot(name: string, operatorOrValue: any, valueOrNull?: WhereValue) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      not: true,
      name,
      operator: !isNull(valueOrNull) ? operatorOrValue : '=',
      value: [!isNull(valueOrNull) ? valueOrNull : operatorOrValue],
    })
    return this
  }

  public orWhereNot(name: string, value: WhereValue): this
  public orWhereNot(name: string, operator: WhereOperator, value: WhereValue): this
  public orWhereNot(name: string, operatorOrValue: any, valueOrNull?: WhereValue) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      or: true,
      not: true,
      name,
      operator: !isNull(valueOrNull) ? operatorOrValue : '=',
      value: [!isNull(valueOrNull) ? valueOrNull : operatorOrValue],
    })
    return this
  }

  public whereIn(name: string, values: WhereValue[]) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      name,
      operator: 'in',
      value: values,
    })
    return this
  }

  public orWhereIn(name: string, values: WhereValue[]) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      or: true,
      name,
      operator: 'in',
      value: values,
    })
    return this
  }

  public whereNotIn(name: string, values: WhereValue[]) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      not: true,
      name,
      operator: 'in',
      value: values,
    })
    return this
  }

  public orWhereNotIn(name: string, values: WhereValue[]) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      or: true,
      not: true,
      name,
      operator: 'in',
      value: values,
    })
    return this
  }

  public whereNull(name: string) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      name,
      operator: 'is null',
    })
    return this
  }

  public orWhereNull(name: string) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      or: true,
      name,
      operator: 'is null',
    })
    return this
  }

  public whereNotNull(name: string) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      not: true,
      name,
      operator: 'is null',
    })
    return this
  }

  public orWhereNotNull(name: string) {
    this.whereStates = this.whereStates || []
    this.whereStates.push({
      or: true,
      not: true,
      name,
      operator: 'is null',
    })
    return this
  }
}
