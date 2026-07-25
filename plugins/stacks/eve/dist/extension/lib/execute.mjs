import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import extension_default from "../extension.mjs";
async function runStacksTool(handler, input, options) {
	const { defaultNetwork, senderKey: configSenderKey } = extension_default.config;
	const params = {
		...input,
		network: input.network ?? defaultNetwork
	};
	if (options?.requireSenderKey) {
		const senderKey = params.senderKey ?? configSenderKey;
		if (!senderKey) throw new Error("senderKey is required for this write tool. Pass it in the tool input or set senderKey in the extension mount config (e.g. process.env.STACKS_SENDER_KEY).");
		params.senderKey = senderKey;
	}
	return handler(params);
}
export { runStacksTool };
