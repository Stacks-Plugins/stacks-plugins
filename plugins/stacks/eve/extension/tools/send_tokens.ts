import { sendTokens } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Sign and broadcast an STX transfer. Requires a sender private key.",
  inputSchema: z.object({
    recipient: z.string(),
    amount: amountSchema.describe("Amount to send in microSTX."),
    memo: z.string().optional(),
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(sendTokens, input, { requireSenderKey: true });
  },
});
