import { z } from "zod";
/** Target network. When omitted, the extension defaultNetwork is injected. */
export declare const networkSchema: z.ZodOptional<z.ZodEnum<{
    mainnet: "mainnet";
    testnet: "testnet";
}>>;
/** Amount fields accept a number or numeric string (microSTX / smallest unit). */
export declare const amountSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
/** Clarity function args as hex-encoded serialized ClarityValues. */
export declare const hexArgsSchema: z.ZodOptional<z.ZodArray<z.ZodString>>;
/**
 * Signing fields for write tools. `senderKey` is optional in the schema —
 * the execute helper injects it from extension config when omitted.
 */
export declare const signedFieldsSchema: {
    senderKey: z.ZodOptional<z.ZodString>;
    fee: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    nonce: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    network: z.ZodOptional<z.ZodEnum<{
        mainnet: "mainnet";
        testnet: "testnet";
    }>>;
};
