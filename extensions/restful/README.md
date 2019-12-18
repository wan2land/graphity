# Graphity Extensions - RESTFul

<a href="https://npmcharts.com/compare/@graphity-extensions/restful?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/@graphity-extensions/restful.svg?style=flat-square" /></a>
<a href="https://www.npmjs.com/package/@graphity-extensions/restful"><img alt="Version" src="https://img.shields.io/npm/v/@graphity-extensions/restful.svg?style=flat-square" /></a>
<img alt="License" src="https://img.shields.io/npm/l/@graphity-extensions/restful.svg?style=flat-square" />
<img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
<br />
<a href="https://david-dm.org/wan2land/graphity?path=extensions/restful"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/graphity.svg?style=flat-square&path=extensions/restful" /></a>

## Installation

```bash
npm install @graphity-extensions/restful --save
```

## Usage

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
