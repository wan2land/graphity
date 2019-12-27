/* eslint-disable import/exports-last */
import { InsertState, QueryMethod, SelectState, UpdateState } from '../interfaces/query-builder'
import { applyMixins } from '../utils/typescript'
import { LimitBuilder } from './limit-builder'
import { OrderByBuilder } from './orderby-builder'
import { WhereBuilder } from './where-builder'


export class Builder {
  public method: QueryMethod = 'select'

  public insertState?: InsertState
  public selectState?: SelectState
  public updateState?: UpdateState

  public constructor(public table: string) {
  }

  public select(columns: string | string[]) {
    this.method = 'select'
    this.selectState = this.selectState || {}
    this.selectState.columns = Array.isArray(columns) ? columns : [columns]
    return this
  }

  public delete() {
    this.method = 'delete'
    return this
  }

  public update(value: {[name: string]: any}) {
    this.method = 'update'
    this.updateState = {
      value,
    }
    return this
  }

  public insert(value: {[name: string]: any} | {[name: string]: any}[]) {
    this.method = 'insert'
    this.insertState = {
      values: Array.isArray(value) ? value : [value],
    }
    return this
  }
}

export interface Builder extends WhereBuilder, OrderByBuilder, LimitBuilder {
  table: string
  method: QueryMethod
  selectState?: SelectState
}

applyMixins(Builder, [WhereBuilder, OrderByBuilder, LimitBuilder])
