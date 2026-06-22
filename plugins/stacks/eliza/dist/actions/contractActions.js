"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractActions = void 0;
const agent_core_1 = require("@sugarhi11/agent-core");
const shared_1 = require("../shared");
exports.contractActions = [
    (0, shared_1.makeAction)({
        name: 'stacks_contract_call',
        description: 'Sign and broadcast a public Clarity contract function call. ' +
            'Params: { contractAddress, contractName, functionName, functionArgsHex?, network? }. senderKey is auto-injected.',
        similes: ['CALL_CONTRACT', 'CONTRACT_CALL', 'CLARITY_CALL'],
        handler: agent_core_1.contractCall,
        signed: true,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_read_only_call',
        description: 'Evaluate a read-only Clarity contract function. ' +
            'Params: { contractAddress, contractName, functionName, functionArgsHex?, senderAddress?, network? }.',
        similes: ['READ_CONTRACT', 'READ_ONLY_CALL'],
        handler: agent_core_1.readOnlyCall,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_decode_cv',
        description: 'Decode a hex-encoded serialized Clarity value into readable JSON. Params: { hex: string }.',
        similes: ['DECODE_CLARITY', 'DECODE_CV'],
        handler: agent_core_1.decodeCv,
    }),
];
