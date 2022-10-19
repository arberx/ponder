import { codegen } from "@graphql-codegen/core";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { GraphQLSchema, parse, printSchema } from "graphql";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { CONFIG } from "@/common/config";
import { formatPrettier } from "@/common/utils";

const header = `
/* Autogenerated file. Do not edit manually. */
`;

const generateSchemaTypes = async (gqlSchema: GraphQLSchema) => {
  const body = await codegen({
    documents: [],
    config: {},
    // used by a plugin internally, although the 'typescript' plugin currently
    // returns the string output, rather than writing to a file
    filename: "",
    schema: parse(printSchema(gqlSchema)),
    plugins: [
      {
        typescript: {},
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
    },
  });

  const final = formatPrettier(header + body);

  await writeFile(
    path.join(CONFIG.GENERATED_DIR_PATH, "schema.ts"),
    final,
    "utf8"
  );
};

export { generateSchemaTypes };
