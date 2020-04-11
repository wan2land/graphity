import { APIGatewayProxyEvent } from 'aws-lambda'
import { HttpRequest } from 'graphity'

export function eventToHttpRequest(event: APIGatewayProxyEvent): HttpRequest {
  const headers = Object.entries(event.headers)
    .reduce<Record<string, string>>((carry, [name, header]) => (carry[name.toLowerCase()] = header, carry), {}) // eslint-disable-line no-return-assign

  return {
    host: event.requestContext.domainName ?? headers.host,
    method: event.httpMethod,
    headers,
    path: event.path,
    query: event.queryStringParameters ?? {},
  }
}
