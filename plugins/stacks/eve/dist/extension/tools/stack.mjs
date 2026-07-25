import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { stack } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var stack_default = defineTool({
	description: "Lock STX for stacking (PoX). Requires a sender private key.",
	inputSchema: z.object({
		amount: amountSchema.describe("Amount of STX to lock, in microSTX."),
		cycles: z.number(),
		poxAddress: z.string().describe("BTC reward address that PoX rewards are paid to."),
		burnBlockHeight: z.number().optional(),
		...signedFieldsSchema
	}),
	approval: always(),
	async execute(input) {
		return runStacksTool(stack, input, { requireSenderKey: true });
	}
});
export { stack_default as default };
