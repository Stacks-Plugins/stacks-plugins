import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { amountSchema, networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { canStack } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
var can_stack_default = defineTool({
	description: "Check whether an address is eligible to stack a given amount and cycle count.",
	inputSchema: z.object({
		address: z.string(),
		amount: amountSchema.describe("Amount of STX to lock, in microSTX."),
		cycles: z.number(),
		poxAddress: z.string().describe("BTC reward address that PoX rewards are paid to."),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(canStack, input);
	}
});
export { can_stack_default as default };
