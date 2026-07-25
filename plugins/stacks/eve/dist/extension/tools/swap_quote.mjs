import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { swapQuote } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
var swap_quote_default = defineTool({
	description: "Get a token swap quote from the ALEX DEX (mainnet).",
	inputSchema: z.object({
		tokenFrom: z.string(),
		tokenTo: z.string(),
		amount: amountSchema,
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(swapQuote, input);
	}
});
export { swap_quote_default as default };
