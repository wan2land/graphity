

export type RequestParam = string | RequestParams | RequestParams[]

export interface RequestParams {
  [name: string]: RequestParam
}

export interface RequestField {
  name: string
  fields: RequestField[]
}

export interface HandleRequest {
  params: RequestParams
  fields: RequestField[]
}

export type Handler<P> = (request: HandleRequest) => Promise<P | null>

export interface Route {
  method: "GET" | "POST"
  path: string
  handler: Handler<any>
}
