import { delegateStx } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Delegate STX to a stacking pool/operator. Requires a sender private key.",
  inputSchema: z.object({
    amount: amountSchema.describe("Maximum amount the delegate may lock, in microSTX."),
    delegateTo: z.string(),
    untilBurnBlockHeight: z.number().optional(),
    poxAddress: z.string().optional(),
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(delegateStx, input, { requireSenderKey: true });
  },
});
