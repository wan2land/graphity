# Graphity - RESTFul

[![Downloads](https://img.shields.io/npm/dt/@graphity/restful.svg)](https://npmcharts.com/compare/@graphity/restful?minimal=true)
[![Version](https://img.shields.io/npm/v/@graphity/restful.svg)](https://www.npmjs.com/package/@graphity/restful)
[![License](https://img.shields.io/npm/l/@graphity/restful.svg)](https://www.npmjs.com/package/@graphity/restful)
![Typescript](https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square)

## How to use

### Installation

```bash
npm install @graphity/restful --save
```

### Simple Example

```typescript
import { createExpressAdapter } from "@graphity/restful"
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

## Licesnse

MIT
