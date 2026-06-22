export declare function extractStacksAddress(text: string): string | undefined;
export declare function extractStxAmount(text: string): string | number | undefined;
export declare function pickActionParams(options?: Record<string, unknown>): Record<string, unknown>;
export declare function normalizeSendParams(params: Record<string, unknown>): Record<string, unknown>;
export declare function resolveParamsFromMessage(message: {
    content?: {
        text?: string;
        params?: unknown;
    };
}, options?: Record<string, unknown>, responses?: Array<{
    content?: {
        text?: string;
    };
}>): Record<string, unknown>;
export declare function requireSendParams(params: Record<string, unknown>): void;
