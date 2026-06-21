"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAction = makeAction;
/**
 * Resolve tool parameters for a call. ElizaOS passes structured arguments via the
 * `options` bag when the model fills a tool; we fall back to the raw message
 * content so the action also works when invoked programmatically.
 */
function resolveParams(message, options) {
    if (options && Object.keys(options).length > 0)
        return options;
    const content = message?.content ?? {};
    // Allow a nested `params` object or the content itself.
    return content.params ?? content;
}
/**
 * Convert a single @stacks/agent-core tool into an ElizaOS {@link Action}.
 * This keeps every adapter a thin shim over the shared implementation.
 */
function makeAction(spec) {
    return {
        name: spec.name.toUpperCase(),
        similes: spec.similes ?? [],
        description: spec.description,
        validate: async (_runtime, _message) => true,
        handler: async (_runtime, message, _state, options, callback) => {
            try {
                const params = resolveParams(message, options);
                const result = await spec.handler(params);
                const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
                if (callback) {
                    await callback({ text, content: { success: true, result } });
                }
                return true;
            }
            catch (error) {
                const text = `Stacks tool ${spec.name} failed: ${error?.message ?? String(error)}`;
                if (callback) {
                    await callback({ text, content: { success: false, error: text } });
                }
                return false;
            }
        },
        examples: spec.examples ?? [],
    };
}
