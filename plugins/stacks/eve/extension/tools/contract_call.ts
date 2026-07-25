import { contractCall } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { hexArgsSchema, signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Sign and broadcast a public Clarity contract function call.",
  inputSchema: z.object({
    contractAddress: z.string(),
    contractName: z.string(),
    functionName: z.string(),
    functionArgsHex: hexArgsSchema,
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(contractCall, input, { requireSenderKey: true });
  },
});
