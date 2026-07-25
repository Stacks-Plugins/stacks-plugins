import { getStackingStatus } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Get the current stacking (PoX) lock and delegation status for an address.",
  inputSchema: z.object({
    address: z.string(),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(getStackingStatus, input);
  },
});
