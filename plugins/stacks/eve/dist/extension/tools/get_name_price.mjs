import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { runStacksTool } from "../lib/execute.mjs";
import { networkSchema } from "../lib/schemas.mjs";
import { z } from "zod";
import { getNamePrice } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
var get_name_price_default = defineTool({
	description: "Get the registration price (microSTX) for a BNS name.",
	inputSchema: z.object({
		name: z.string().describe("Fully-qualified BNS name to price, e.g. myname.btc."),
		network: networkSchema
	}),
	async execute(input) {
		return runStacksTool(getNamePrice, input);
	}
});
export { get_name_price_default as default };
