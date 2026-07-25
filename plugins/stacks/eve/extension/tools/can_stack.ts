import { canStack } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Check whether an address is eligible to stack a given amount and cycle count.",
  inputSchema: z.object({
    address: z.string(),
    amount: amountSchema.describe("Amount of STX to lock, in microSTX."),
    cycles: z.number(),
    poxAddress: z.string().describe("BTC reward address that PoX rewards are paid to."),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(canStack, input);
  },
});
