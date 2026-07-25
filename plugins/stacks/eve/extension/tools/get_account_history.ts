import { getAccountHistory } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Get paginated transaction history for a Stacks address.",
  inputSchema: z.object({
    address: z.string(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(getAccountHistory, input);
  },
});
