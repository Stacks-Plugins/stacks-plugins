import { swapExecute } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, hexArgsSchema, signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Execute a token swap on the ALEX DEX. Requires a sender key and encoded route.",
  inputSchema: z.object({
    tokenFrom: z.string(),
    tokenTo: z.string(),
    amount: amountSchema,
    minAmountOut: amountSchema,
    functionArgsHex: hexArgsSchema,
    functionName: z.string().optional(),
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(swapExecute, input, { requireSenderKey: true });
  },
});
