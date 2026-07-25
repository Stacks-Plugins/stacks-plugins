import { bridgeQuote } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Get a cross-chain bridge quote via Allbridge Core.",
  inputSchema: z.object({
    fromChain: z.string(),
    toChain: z.string(),
    token: z.string(),
    amount: amountSchema,
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(bridgeQuote, input);
  },
});
