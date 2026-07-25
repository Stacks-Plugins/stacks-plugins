import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { bridgeInitiate } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var bridge_initiate_default = defineTool({
	description: "Initiate a cross-chain bridge transfer (guided; see tool notes).",
	inputSchema: z.object({
		fromChain: z.string(),
		toChain: z.string(),
		token: z.string(),
		amount: amountSchema,
		recipient: z.string(),
		...signedFieldsSchema
	}),
	approval: always(),
	async execute(input) {
		return runStacksTool(bridgeInitiate, input, { requireSenderKey: true });
	}
});
export { bridge_initiate_default as default };
