import { revokeDelegate } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { signedFieldsSchema } from "../lib/schemas";

export default defineTool({
  description: "Revoke an active stacking delegation. Requires a sender private key.",
  inputSchema: z.object({
    ...signedFieldsSchema,
  }),
  approval: always(),
  async execute(input) {
    return runStacksTool(revokeDelegate, input, { requireSenderKey: true });
  },
});
