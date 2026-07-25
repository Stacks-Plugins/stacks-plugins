import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { signedFieldsSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { revokeDelegate } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
var revoke_delegate_default = defineTool({
	description: "Revoke an active stacking delegation. Requires a sender private key.",
	inputSchema: z.object({ ...signedFieldsSchema }),
	approval: always(),
	async execute(input) {
		return runStacksTool(revokeDelegate, input, { requireSenderKey: true });
	}
});
export { revoke_delegate_default as default };
