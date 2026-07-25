import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { delegateStx } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var delegate_stx_default = defineTool({
	description: "Delegate STX to a stacking pool/operator. Requires a sender private key.",
	inputSchema: z.object({
		amount: amountSchema.describe("Maximum amount the delegate may lock, in microSTX."),
		delegateTo: z.string(),
		untilBurnBlockHeight: z.number().optional(),
		poxAddress: z.string().optional(),
		...signedFieldsSchema
	}),
	approval: always(),
	async execute(input) {
		return runStacksTool(delegateStx, input, { requireSenderKey: true });
	}
});
export { delegate_stx_default as default };
