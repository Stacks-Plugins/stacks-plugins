import { decodeCv } from "@stacks/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Decode a hex-encoded serialized Clarity value into readable JSON.",
  inputSchema: z.object({
    hex: z.string().describe("Hex-encoded serialized Clarity value."),
  }),
  async execute(input) {
    return decodeCv(input);
  },
});
