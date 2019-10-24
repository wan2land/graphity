# Graphity Extensions - RESTFul

[![Downloads](https://img.shields.io/npm/dt/@graphity-extensions/restful.svg)](https://npmcharts.com/compare/@graphity-extensions/restful?minimal=true)
[![Version](https://img.shields.io/npm/v/@graphity-extensions/restful.svg)](https://www.npmjs.com/package/@graphity-extensions/restful)
[![License](https://img.shields.io/npm/l/@graphity-extensions/restful.svg)](https://www.npmjs.com/package/@graphity-extensions/restful)
![Typescript](https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square)

## How to use

### Installation

```bash
npm install @graphity-extensions/restful --save
```

### Simple Example

```typescript
import { createExpressAdapter } from "@graphity-extensions/restful"
import { ApolloServer } from "apollo-server-express"
import bodyParser from "body-parser"

const schema = { ... } // GraphQLSchema 

const apollo = new ApolloServer({
  schema,
})

const app = express()

apollo.applyMiddleware({app})

app.use(bodyParser())
app.use(createExpressAdapter(schema, {
  endpoints: [
    {
      method: "GET",
      path: "/",
      query: (req) => ({
        document: parse(`query { version }`),
      })
    },
    {
      method: "POST",
      path: "/articles",
      query: (req) => ({
        document: parse(`mutation($title: String!, $contents: String) {
          article: createArticle(title: $title, contents: $contents) {
            id
            title
            contents
          }
        }`),
        values: {
          title: req.body.title,
          contents: req.body.contents,
        },
      })
    },
  ],
}))

app.listen(8080)
```
