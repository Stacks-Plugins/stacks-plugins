import { getNamePrice } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Get the registration price (microSTX) for a BNS name.",
  inputSchema: z.object({
    name: z.string().describe("Fully-qualified BNS name to price, e.g. myname.btc."),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(getNamePrice, input);
  },
});
