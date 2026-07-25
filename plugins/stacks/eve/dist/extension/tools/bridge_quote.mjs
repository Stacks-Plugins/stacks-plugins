import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { bridgeQuote } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
var bridge_quote_default = defineTool({
	description: "Get a cross-chain bridge quote via Allbridge Core.",
	inputSchema: z.object({
		fromChain: z.string(),
		toChain: z.string(),
		token: z.string(),
		amount: amountSchema,
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(bridgeQuote, input);
	}
});
export { bridge_quote_default as default };
