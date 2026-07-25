import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { resolveName } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
var resolve_name_default = defineTool({
	description: "Resolve a BNS name to its owner address and zonefile.",
	inputSchema: z.object({
		name: z.string().describe("Fully-qualified BNS name, e.g. muneeb.id."),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(resolveName, input);
	}
});
export { resolve_name_default as default };
