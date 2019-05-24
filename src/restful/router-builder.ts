import { GraphQLSchema, introspectionFromSchema, IntrospectionType } from "graphql"

import { Route } from "../interfaces/restful"
import { toDashCase } from "../utils/string"


export class RouterBuilder {
  public buildRouterSchema(gqlSchema: GraphQLSchema): Route[] {
    const intro = introspectionFromSchema(gqlSchema).__schema

    const types = intro.types.filter((type) => type.name !== "__Schema")
    const typesMap = types.reduce<{[name: string]: IntrospectionType}>((carry, type) => {
      return Object.assign(carry, {[type.name]: type})
    }, {})

    const routes = [] as Route[]
    const queryType = typesMap[intro.queryType.name]
    if (queryType.kind === "OBJECT") {
      queryType.fields.forEach((field) => {
        routes.push({
          method: "GET",
          path: toDashCase(field.name),
        })
      })
    }

    const mutationType = intro.mutationType ? typesMap[intro.mutationType.name] : null
    if (mutationType && mutationType.kind === "OBJECT") {
      mutationType.fields.forEach((field) => {
        routes.push({
          method: "POST",
          path: toDashCase(field.name),
        })
      })
    }

    return routes
  }
}
