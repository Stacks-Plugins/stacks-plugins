import { createFetchFn } from '@stacks/common';
import { defaultUrlFromNetwork, networkFrom, } from '@stacks/network';
/** Hiro API base URL for the given network. Used for the extended REST endpoints. */
export function apiUrl(network = 'mainnet') {
    const net = networkFrom(network);
    return defaultUrlFromNetwork(net);
}
/** A `client` object compatible with stacks.js fetch helpers ({ baseUrl, fetch }). */
export function stacksClient(network = 'mainnet') {
    return { baseUrl: apiUrl(network), fetch: createFetchFn() };
}
/** Normalize a loose network arg into a strict {@link StacksNetworkName}. */
export function resolveNetwork(network) {
    return (network ?? 'mainnet');
}
/** Shared fetch function for raw REST calls against the Hiro API. */
export const fetchFn = createFetchFn();
