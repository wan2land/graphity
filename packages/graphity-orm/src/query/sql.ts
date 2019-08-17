import { QueryFragment } from './query-fragment'


export const sql = (literals: TemplateStringsArray, ...placeholders: any[]): QueryFragment => {
  return new QueryFragment(literals.map(l => l), placeholders)
}
