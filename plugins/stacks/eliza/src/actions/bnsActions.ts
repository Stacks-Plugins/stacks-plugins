import {
  getNamePrice,
  lookupAddress,
  resolveName,
  transferName,
} from '@sugarhi11/agent-core';
import type { Action } from '@elizaos/core';
import { makeAction } from '../shared';

export const bnsActions: Action[] = [
  makeAction({
    name: 'stacks_resolve_name',
    description:
      'Resolve a BNS name to its owner address and zonefile. Params: { name: string, network? }.',
    similes: ['RESOLVE_BNS', 'LOOKUP_NAME', 'RESOLVE_STACKS_NAME'],
    handler: resolveName,
  }),
  makeAction({
    name: 'stacks_lookup_address',
    description:
      'List all BNS names owned by a Stacks address. Params: { address: string, network? }.',
    similes: ['NAMES_FOR_ADDRESS', 'REVERSE_BNS_LOOKUP'],
    handler: lookupAddress,
  }),
  makeAction({
    name: 'stacks_get_name_price',
    description:
      'Get the registration price (microSTX) for a BNS name. Params: { name: string, network? }.',
    similes: ['BNS_PRICE', 'NAME_PRICE'],
    handler: getNamePrice,
  }),
  makeAction({
    name: 'stacks_transfer_name',
    description:
      'Transfer ownership of a BNS name to another address. ' +
      'Params: { name, newOwnerAddress, senderKey, zonefile?, network? }.',
    similes: ['TRANSFER_BNS', 'TRANSFER_NAME'],
    handler: transferName,
  }),
];
