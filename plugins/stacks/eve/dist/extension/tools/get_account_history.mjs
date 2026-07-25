import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { getAccountHistory } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
var get_account_history_default = defineTool({
	description: "Get paginated transaction history for a Stacks address.",
	inputSchema: z.object({
		address: z.string(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(getAccountHistory, input);
	}
});
export { get_account_history_default as default };
