module.exports = {
  setupFilesAfterEnv: [
    "./packages/graphity/test/setup-graphql.ts",
  ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "[^/]*\\.test.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
  ],
}
