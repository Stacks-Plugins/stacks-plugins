import { defineExtension } from "eve/extension";
import { z } from "zod";

export default defineExtension({
  config: z.object({
    defaultNetwork: z.enum(["mainnet", "testnet"]).default("mainnet"),
    /** Hex-encoded private key for write tools. Prefer passing from env at mount time. */
    senderKey: z.string().optional(),
  }),
});
