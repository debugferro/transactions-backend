
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/graphql/schema.graphql",
  generates: {
    "./src/graphql/__generated__/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    },
    "./src/graphql/graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
