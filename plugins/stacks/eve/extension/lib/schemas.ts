import { z } from "zod";

/** Target network. When omitted, the extension defaultNetwork is injected. */
export const networkSchema = z
  .enum(["mainnet", "testnet"])
  .optional()
  .describe("Target network. Defaults to the extension defaultNetwork.");

/** Amount fields accept a number or numeric string (microSTX / smallest unit). */
export const amountSchema = z.union([z.string(), z.number()]);

/** Clarity function args as hex-encoded serialized ClarityValues. */
export const hexArgsSchema = z
  .array(z.string())
  .optional()
  .describe("Clarity function args as hex-encoded serialized ClarityValues.");

/**
 * Signing fields for write tools. `senderKey` is optional in the schema —
 * the execute helper injects it from extension config when omitted.
 */
export const signedFieldsSchema = {
  senderKey: z
    .string()
    .optional()
    .describe("Hex-encoded sender private key. Injected from extension config when omitted."),
  fee: amountSchema.optional().describe("Transaction fee in microSTX (auto-estimated if omitted)."),
  nonce: amountSchema.optional().describe("Account nonce (auto-fetched if omitted)."),
  network: networkSchema,
};
