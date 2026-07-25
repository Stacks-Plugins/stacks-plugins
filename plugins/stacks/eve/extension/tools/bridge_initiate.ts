import { bridgeInitiate } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { amountSchema, signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Initiate a cross-chain bridge transfer (guided; see tool notes).",
  inputSchema: z.object({
    fromChain: z.string(),
    toChain: z.string(),
    token: z.string(),
    amount: amountSchema,
    recipient: z.string(),
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(bridgeInitiate, input, { requireSenderKey: true });
  },
});
