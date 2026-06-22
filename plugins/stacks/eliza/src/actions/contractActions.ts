import { contractCall, decodeCv, readOnlyCall } from '@sugarhi11/agent-core';
import type { Action } from '@elizaos/core';
import { makeAction } from '../shared';

export const contractActions: Action[] = [
  makeAction({
    name: 'stacks_contract_call',
    description:
      'Sign and broadcast a public Clarity contract function call. ' +
      'Params: { contractAddress, contractName, functionName, functionArgsHex?, network? }. senderKey is auto-injected.',
    similes: ['CALL_CONTRACT', 'CONTRACT_CALL', 'CLARITY_CALL'],
    handler: contractCall,
    signed: true,
  }),
  makeAction({
    name: 'stacks_read_only_call',
    description:
      'Evaluate a read-only Clarity contract function. ' +
      'Params: { contractAddress, contractName, functionName, functionArgsHex?, senderAddress?, network? }.',
    similes: ['READ_CONTRACT', 'READ_ONLY_CALL'],
    handler: readOnlyCall,
  }),
  makeAction({
    name: 'stacks_decode_cv',
    description:
      'Decode a hex-encoded serialized Clarity value into readable JSON. Params: { hex: string }.',
    similes: ['DECODE_CLARITY', 'DECODE_CV'],
    handler: decodeCv,
  }),
];
