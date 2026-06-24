"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFn = void 0;
exports.apiUrl = apiUrl;
exports.stacksClient = stacksClient;
exports.resolveNetwork = resolveNetwork;
const common_1 = require("@stacks/common");
const network_1 = require("@stacks/network");
/** Hiro API base URL for the given network. Used for the extended REST endpoints. */
function apiUrl(network = 'mainnet') {
    const net = (0, network_1.networkFrom)(network);
    return (0, network_1.defaultUrlFromNetwork)(net);
}
/** A `client` object compatible with stacks.js fetch helpers ({ baseUrl, fetch }). */
function stacksClient(network = 'mainnet') {
    return { baseUrl: apiUrl(network), fetch: (0, common_1.createFetchFn)() };
}
/** Normalize a loose network arg into a strict {@link StacksNetworkName}. */
function resolveNetwork(network) {
    return (network ?? 'mainnet');
}
/** Shared fetch function for raw REST calls against the Hiro API. */
exports.fetchFn = (0, common_1.createFetchFn)();
