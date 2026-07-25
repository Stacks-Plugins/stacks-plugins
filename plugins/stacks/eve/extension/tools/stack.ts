import { stack } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Lock STX for stacking (PoX). Requires a sender private key.",
  inputSchema: z.object({
    amount: amountSchema.describe("Amount of STX to lock, in microSTX."),
    cycles: z.number(),
    poxAddress: z.string().describe("BTC reward address that PoX rewards are paid to."),
    burnBlockHeight: z.number().optional(),
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(stack, input, { requireSenderKey: true });
  },
});
