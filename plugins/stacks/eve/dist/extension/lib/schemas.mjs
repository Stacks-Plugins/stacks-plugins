import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
import { createRequire as __eveCreateRequire } from "node:module";
__eveDirname(__eveFileURLToPath(import.meta.url));
__eveCreateRequire(import.meta.url);
import { z } from "zod";
const networkSchema = z.enum(["mainnet", "testnet"]).optional().describe("Target network. Defaults to the extension defaultNetwork.");
const amountSchema = z.union([z.string(), z.number()]);
const hexArgsSchema = z.array(z.string()).optional().describe("Clarity function args as hex-encoded serialized ClarityValues.");
const signedFieldsSchema = {
	senderKey: z.string().optional().describe("Hex-encoded sender private key. Injected from extension config when omitted."),
	fee: amountSchema.optional().describe("Transaction fee in microSTX (auto-estimated if omitted)."),
	nonce: amountSchema.optional().describe("Account nonce (auto-fetched if omitted)."),
	network: networkSchema
};
export { amountSchema, hexArgsSchema, networkSchema, signedFieldsSchema };
