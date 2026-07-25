import { readOnlyCall } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { hexArgsSchema, networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Evaluate a read-only Clarity contract function and return decoded JSON.",
  inputSchema: z.object({
    contractAddress: z.string(),
    contractName: z.string(),
    functionName: z.string(),
    functionArgsHex: hexArgsSchema,
    senderAddress: z.string().optional(),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(readOnlyCall, input);
  },
});
