import { FetchFn } from '@stacks/common';
import { StacksNetworkName } from '@stacks/network';
import { NetworkArg } from './types';
/** Hiro API base URL for the given network. Used for the extended REST endpoints. */
export declare function apiUrl(network?: NetworkArg): string;
/** A `client` object compatible with stacks.js fetch helpers ({ baseUrl, fetch }). */
export declare function stacksClient(network?: NetworkArg): {
    baseUrl: string;
    fetch: FetchFn;
};
/** Normalize a loose network arg into a strict {@link StacksNetworkName}. */
export declare function resolveNetwork(network?: NetworkArg): StacksNetworkName;
/** Shared fetch function for raw REST calls against the Hiro API. */
export declare const fetchFn: FetchFn;
