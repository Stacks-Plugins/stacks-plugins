import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, hexArgsSchema, signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { swapExecute } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var swap_execute_default = defineTool({
	description: "Execute a token swap on the ALEX DEX. Requires a sender key and encoded route.",
	inputSchema: z.object({
		tokenFrom: z.string(),
		tokenTo: z.string(),
		amount: amountSchema,
		minAmountOut: amountSchema,
		functionArgsHex: hexArgsSchema,
		functionName: z.string().optional(),
		...signedFieldsSchema
	}),
	approval: always(),
	async execute(input) {
		return runStacksTool(swapExecute, input, { requireSenderKey: true });
	}
});
export { swap_execute_default as default };
