import { FetchFn } from '@stacks/common';
import { StacksNetworkName } from '@stacks/network';
import { NetworkArg } from './types';
export declare function apiUrl(network?: NetworkArg): string;
export declare function stacksClient(network?: NetworkArg): {
    baseUrl: string;
    fetch: FetchFn;
};
export declare function resolveNetwork(network?: NetworkArg): StacksNetworkName;
export declare const fetchFn: FetchFn;
