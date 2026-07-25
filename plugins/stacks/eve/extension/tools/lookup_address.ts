import { lookupAddress } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { networkSchema } from "../lib/schemas";

export default defineTool({
  description: "List all BNS names owned by a Stacks address.",
  inputSchema: z.object({
    address: z.string(),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(lookupAddress, input);
  },
});
