import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { z } from "zod";
import { decodeCv } from "@sugarhi11/agent-core";
import { defineTool } from "eve/tools";
var decode_cv_default = defineTool({
	description: "Decode a hex-encoded serialized Clarity value into readable JSON.",
	inputSchema: z.object({ hex: z.string().describe("Hex-encoded serialized Clarity value.") }),
	async execute(input) {
		return decodeCv(input);
	}
});
export { decode_cv_default as default };
