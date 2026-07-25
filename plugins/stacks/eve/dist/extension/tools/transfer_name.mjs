import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { transferName } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var transfer_name_default = defineTool({
	description: "Transfer ownership of a BNS name to another address. Requires a sender key.",
	inputSchema: z.object({
		name: z.string(),
		newOwnerAddress: z.string(),
		zonefile: z.string().optional(),
		...signedFieldsSchema
	}),
	approval: always(),
	async execute(input) {
		return runStacksTool(transferName, input, { requireSenderKey: true });
	}
});
export { transfer_name_default as default };
