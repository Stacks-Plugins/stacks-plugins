import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { lookupAddress } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
var lookup_address_default = defineTool({
	description: "List all BNS names owned by a Stacks address.",
	inputSchema: z.object({
		address: z.string(),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(lookupAddress, input);
	}
});
export { lookup_address_default as default };
