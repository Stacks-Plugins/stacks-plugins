import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { hexArgsSchema, signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { contractCall } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var contract_call_default = defineTool({
	description: "Sign and broadcast a public Clarity contract function call.",
	inputSchema: z.object({
		contractAddress: z.string(),
		contractName: z.string(),
		functionName: z.string(),
		functionArgsHex: hexArgsSchema,
		...signedFieldsSchema
	}),
	approval: always(),
	async execute(input) {
		return runStacksTool(contractCall, input, { requireSenderKey: true });
	}
});
export { contract_call_default as default };
