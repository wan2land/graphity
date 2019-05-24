import { RequestField } from "../interfaces/restful"

function internalParseQueryFields(fields: string[]): RequestField[] {
  const groups = fields.reduce<{[name: string]: string[]}>((carry, field) => {
    const p = field.indexOf(".")
    let fieldName = field
    let nextField = ""
    if (p > -1) {
      fieldName = field.slice(0, p)
      nextField = field.slice(p + 1)
    }
    carry[fieldName] = carry[fieldName] || []
    if (nextField) {
      carry[fieldName].push(nextField)
    }
    return carry
  }, {})
  return Object.keys(groups).map((group): RequestField => ({
    name: group,
    fields: internalParseQueryFields(groups[group]),
  }))
}

export function parseQueryFields(fields: string[]): RequestField[] {
  return internalParseQueryFields(fields.map(field => field.replace(/\.+/g, ".").replace(/^\.|\.$/, "")))
}
