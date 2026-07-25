import { resolveName } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { runStacksTool } from "../lib/execute";
import { networkSchema } from "../lib/schemas";

export default defineTool({
  description: "Resolve a BNS name to its owner address and zonefile.",
  inputSchema: z.object({
    name: z.string().describe("Fully-qualified BNS name, e.g. muneeb.id."),
    network: networkSchema,
  }),
  async execute(input) {
    return runStacksTool(resolveName, input);
  },
});
