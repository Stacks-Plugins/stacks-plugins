import { createFetchFn, FetchFn } from '@stacks/common';
import {
  defaultUrlFromNetwork,
  networkFrom,
  StacksNetwork,
  StacksNetworkName,
} from '@stacks/network';
import { NetworkArg } from './types';

/** Hiro API base URL for the given network. Used for the extended REST endpoints. */
export function apiUrl(network: NetworkArg = 'mainnet'): string {
  const net: StacksNetwork = networkFrom(network);
  return defaultUrlFromNetwork(net);
}

/** A `client` object compatible with stacks.js fetch helpers ({ baseUrl, fetch }). */
export function stacksClient(network: NetworkArg = 'mainnet'): {
  baseUrl: string;
  fetch: FetchFn;
} {
  return { baseUrl: apiUrl(network), fetch: createFetchFn() };
}

/** Normalize a loose network arg into a strict {@link StacksNetworkName}. */
export function resolveNetwork(network?: NetworkArg): StacksNetworkName {
  return (network ?? 'mainnet') as StacksNetworkName;
}

/** Shared fetch function for raw REST calls against the Hiro API. */
export const fetchFn: FetchFn = createFetchFn();
