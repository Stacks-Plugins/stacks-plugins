import type { TSchema } from 'typebox';
export type ToolHandler = (params: any) => Promise<any> | any;
export interface ToolSpec {
    name: string;
    label?: string;
    description: string;
    parameters: TSchema;
    handler: ToolHandler;
    /** Mark write tools that require signing (senderKey injected from env). */
    signed?: boolean;
    /** Convert `amount` from STX to microSTX before calling the handler. */
    parseAmount?: boolean;
    /** OpenClaw optional tool registration (write tools). */
    optional?: boolean;
    formatResult?: (result: unknown, params: Record<string, unknown>) => string;
}
export interface ToolRuntimeContext {
    pluginConfig?: {
        defaultNetwork?: string;
    };
}
export declare function enrichParams(spec: ToolSpec, params: Record<string, unknown>, ctx: ToolRuntimeContext): Record<string, unknown>;
export declare function executeTool(spec: ToolSpec, rawParams: Record<string, unknown>, ctx: ToolRuntimeContext): Promise<{
    text: string;
    isError: boolean;
}>;
