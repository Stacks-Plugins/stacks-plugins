import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { getBalance } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
var get_balance_default = defineTool({
	description: "Get STX, fungible, and non-fungible token balances for a Stacks address.",
	inputSchema: z.object({
		address: z.string(),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(getBalance, input);
	}
});
export { get_balance_default as default };
