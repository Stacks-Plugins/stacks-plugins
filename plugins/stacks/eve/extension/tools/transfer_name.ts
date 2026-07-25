import { transferName } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Transfer ownership of a BNS name to another address. Requires a sender key.",
  inputSchema: z.object({
    name: z.string(),
    newOwnerAddress: z.string(),
    zonefile: z.string().optional(),
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(transferName, input, { requireSenderKey: true });
  },
});
