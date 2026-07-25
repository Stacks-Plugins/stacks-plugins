import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { defineExtension } from "eve/extension";
import { z } from "zod";
var extension_default = defineExtension({ config: z.object({
	defaultNetwork: z.enum(["mainnet", "testnet"]).default("mainnet"),
	senderKey: z.string().optional()
}) });
export { extension_default as default };
