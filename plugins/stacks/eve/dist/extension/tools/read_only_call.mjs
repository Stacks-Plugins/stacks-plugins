import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { hexArgsSchema, networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { readOnlyCall } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
var read_only_call_default = defineTool({
	description: "Evaluate a read-only Clarity contract function and return decoded JSON.",
	inputSchema: z.object({
		contractAddress: z.string(),
		contractName: z.string(),
		functionName: z.string(),
		functionArgsHex: hexArgsSchema,
		senderAddress: z.string().optional(),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(readOnlyCall, input);
	}
});
export { read_only_call_default as default };
