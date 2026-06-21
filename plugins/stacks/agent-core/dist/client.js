"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFn = void 0;
exports.apiUrl = apiUrl;
exports.stacksClient = stacksClient;
exports.resolveNetwork = resolveNetwork;
const common_1 = require("@stacks/common");
const network_1 = require("@stacks/network");
function apiUrl(network = 'mainnet') {
    const net = (0, network_1.networkFrom)(network);
    return (0, network_1.defaultUrlFromNetwork)(net);
}
function stacksClient(network = 'mainnet') {
    return { baseUrl: apiUrl(network), fetch: (0, common_1.createFetchFn)() };
}
function resolveNetwork(network) {
    return (network ?? 'mainnet');
}
exports.fetchFn = (0, common_1.createFetchFn)();
//# sourceMappingURL=client.js.map