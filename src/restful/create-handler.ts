import {
  ArgumentNode,
  execute,
  GraphQLArgument,
  GraphQLFieldMap,
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLSchema,
  isInputObjectType,
  isListType,
  isNonNullType,
  ObjectFieldNode,
  SelectionNode,
  SelectionSetNode,
  ValueNode,
} from "graphql"

import { Handler, RequestField, RequestParam, RequestParams } from "../interfaces/restful"

function createSelectionSetNode(fields: RequestField[]): SelectionSetNode {
  return {
    kind: "SelectionSet",
    selections: fields.map((field): SelectionNode => ({
      kind: "Field",
      name: {
        kind: "Name",
        value: field.name,
      },
      selectionSet: createSelectionSetNode(field.fields),
    })),
  }
}

function createValueNode(type: GraphQLInputType, value: RequestParam): ValueNode {
  // GraphQLScalarType | GraphQLEnumType | GraphQLInputObjectType | GraphQLList<any>
  type = (isNonNullType(type) ? type.ofType : type) as Exclude<GraphQLInputType, GraphQLNonNull<any>>
  if (isListType(type)) {
    const listType = type.ofType
    return {
      kind: "ListValue",
      values: (Array.isArray(value) ? value : [value]).map(value => createValueNode(listType, value))
    }
  }
  if (isInputObjectType(type)) {
    if (Array.isArray(value) || typeof value === "string") {
      return {
        kind: "ObjectValue",
        fields: [],
      }
    }
    const objectFields = type.getFields()
    return {
      kind: "ObjectValue",
      fields: Object.keys(value).filter(name => objectFields[name]).map((name): ObjectFieldNode => ({
        kind: "ObjectField",
        name: {
          kind: "Name",
          value: name,
        },
        value: createValueNode(objectFields[name].type, value[name]),
      })),
    }
  }
  if (typeof value !== "string") {
    return {
      kind: "NullValue",
    }
  }
  if (type.name === "Boolean") {
    return {
      kind: "BooleanValue",
      value: value !== "" && (value === "true" || value === "1") || false,
    }
  }
  if (type.name === "Int") {
    return {
      kind: "IntValue",
      value: value,
    }
  }
  if (type.name === "Float") {
    return {
      kind: "FloatValue",
      value: value,
    }
  }
  return {
    kind: "StringValue",
    value: value,
  }
}

function createArgumentNodes(args: GraphQLArgument[], params: RequestParams): ArgumentNode[] {
  return args.filter(arg => params[arg.name]).map((arg): ArgumentNode => ({
    kind: "Argument",
    name: {
      kind: "Name",
      value: arg.name,
    },
    value: createValueNode(arg.type, params[arg.name]),
  }))
}


export function createHttpHandler<P>(
  schema: GraphQLSchema,
  operationType: "query" | "mutation",
  operationName: string
): Handler<P> {
  let fields: GraphQLFieldMap<any, any>
  if (operationType === "mutation") {
    const mutation = schema.getMutationType()
    if (!mutation) {
      throw Object.assign(new Error("cannot find mutation type"), {code: "NOT_FOUND_MUATION"})
    }
    fields = mutation.getFields()
  } else {
    const query = schema.getQueryType()
    if (!query) {
      throw Object.assign(new Error("cannot find query type"), {code: "NOT_FOUND_QUERY"})
    }
    fields = query.getFields()
  }
  const field = fields[operationName]
  if (!field) {
    throw Object.assign(new Error(`cannot find operation "${operationName}"`), {code: "NOT_FOUND_OPERATION"})
  }

  return async (request) => {
    const result = await execute(schema, {
      kind: "Document",
      definitions: [
        {
          kind: "OperationDefinition",
          operation: operationType,
          selectionSet: {
            kind: "SelectionSet",
            selections: [
              {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: operationName,
                },
                arguments: createArgumentNodes(field.args, request.params),
                selectionSet: createSelectionSetNode(request.fields),
              },
            ],
          },
        }
      ],
    })
    if (result.errors) {
      console.log("error", JSON.stringify(result.errors, null, "  "))
    }
    return (result.data && result.data[operationName] as P) || null
  }
}
