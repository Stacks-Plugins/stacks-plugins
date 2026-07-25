import { swapQuote } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Get a token swap quote from the ALEX DEX (mainnet).",
  inputSchema: z.object({
    tokenFrom: z.string(),
    tokenTo: z.string(),
    amount: amountSchema,
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(swapQuote, input);
  },
});
