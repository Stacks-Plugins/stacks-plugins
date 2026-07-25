import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { sendTokens } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var send_tokens_default = defineTool({
	description: "Sign and broadcast an STX transfer. Requires a sender private key.",
	inputSchema: z.object({
		recipient: z.string(),
		amount: amountSchema.describe("Amount to send in microSTX."),
		memo: z.string().optional(),
		...signedFieldsSchema
	}),
	approval: always(),
	async execute(input) {
		return runStacksTool(sendTokens, input, { requireSenderKey: true });
	}
});
export { send_tokens_default as default };
