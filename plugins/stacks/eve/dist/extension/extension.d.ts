import { z } from "zod";
declare const _default: import("eve/extension").ExtensionHandle<z.ZodObject<{
    defaultNetwork: z.ZodDefault<z.ZodEnum<{
        mainnet: "mainnet";
        testnet: "testnet";
    }>>;
    senderKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export default _default;
