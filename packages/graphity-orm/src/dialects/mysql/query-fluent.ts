// import { QueryStatement } from '../../interfaces/query'
// import { QueryFluent } from '../../interfaces/repository'
// import { QueryFragment } from '../../query/query-fragment'

// export class MysqlQueryFluent<TEntity> implements QueryFluent<TEntity>, QueryStatement {
//   public literals: string[] = []
//   public placeholders: any[] = []

//   // public conditions: {
//   //   operator: 'OR' | 'AND'
//   //   query: QueryFragment
//   // }[] = []

//   public where(name: keyof TEntity, value: any): this {
//     // this.conditions.push({ operator: 'AND', query: new QueryFragment([`\`${name}\` = `, ''], [value]) })
//     return this
//   }

//   public whereRaw(raw: QueryFragment): this {
//     // this.conditions.push({ operator: 'AND', query: raw })
//     return this
//   }

//   public orWhere(name: keyof TEntity, value: any): this {
//     // this.conditions.push({ operator: 'OR', query: new QueryFragment([`\`${name}\` = `, ''], [value]) })
//     return this
//   }

//   public orWhereRaw(raw: QueryFragment): this {
//     // this.conditions.push({ operator: 'OR', query: raw })
//     return this
//   }
// }
