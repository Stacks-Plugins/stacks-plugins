import { getBalance } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Get STX, fungible, and non-fungible token balances for a Stacks address.",
  inputSchema: z.object({
    address: z.string(),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(getBalance, input);
  },
});
