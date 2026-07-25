import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { getStackingStatus } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
var stacking_status_default = defineTool({
	description: "Get the current stacking (PoX) lock and delegation status for an address.",
	inputSchema: z.object({
		address: z.string(),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(getStackingStatus, input);
	}
});
export { stacking_status_default as default };
