import { Type } from 'typebox';
export declare const stacksConfigSchema: Type.TObject<{
    defaultNetwork: Type.TOptional<Type.TUnion<[Type.TLiteral<"mainnet">, Type.TLiteral<"testnet">]>>;
}>;
export type StacksPluginConfig = {
    defaultNetwork?: 'mainnet' | 'testnet';
};
