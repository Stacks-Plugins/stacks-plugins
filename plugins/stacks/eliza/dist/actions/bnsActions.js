"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bnsActions = void 0;
const agent_core_1 = require("@stacks/agent-core");
const shared_1 = require("../shared");
exports.bnsActions = [
    (0, shared_1.makeAction)({
        name: 'stacks_resolve_name',
        description: 'Resolve a BNS name to its owner address and zonefile. Params: { name: string, network? }.',
        similes: ['RESOLVE_BNS', 'LOOKUP_NAME', 'RESOLVE_STACKS_NAME'],
        handler: agent_core_1.resolveName,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_lookup_address',
        description: 'List all BNS names owned by a Stacks address. Params: { address: string, network? }.',
        similes: ['NAMES_FOR_ADDRESS', 'REVERSE_BNS_LOOKUP'],
        handler: agent_core_1.lookupAddress,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_get_name_price',
        description: 'Get the registration price (microSTX) for a BNS name. Params: { name: string, network? }.',
        similes: ['BNS_PRICE', 'NAME_PRICE'],
        handler: agent_core_1.getNamePrice,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_transfer_name',
        description: 'Transfer ownership of a BNS name to another address. ' +
            'Params: { name, newOwnerAddress, senderKey, zonefile?, network? }.',
        similes: ['TRANSFER_BNS', 'TRANSFER_NAME'],
        handler: agent_core_1.transferName,
    }),
];
