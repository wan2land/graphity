import { GraphQLSchema } from "graphql"

import { Route } from "../interfaces/restful"
import { toDashCase } from "../utils/string"
import { createHttpHandler } from "./create-handler"


export class RouterBuilder {
  public buildRouterSchema(schema: GraphQLSchema): Route[] {
    const routes = [] as Route[]
    const queryType = schema.getQueryType()
    if (queryType) {
      const fields = queryType.getFields()
      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName]
        const id = field.args.find(arg => arg.name === "id")
        routes.push({
          method: "GET",
          path: toDashCase(field.name) + (id ? "/:id" : ""),
          handler: createHttpHandler(schema, "query", field.name),
        })
      })
    }

    const mutationType = schema.getMutationType()
    if (mutationType) {
      const fields = mutationType.getFields()
      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName]
        routes.push({
          method: "POST",
          path: toDashCase(field.name),
          handler: createHttpHandler(schema, "mutation", field.name),
        })
      })
    }

    return routes
  }
}
