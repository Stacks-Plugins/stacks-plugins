"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stackingActions = void 0;
const agent_core_1 = require("@stacks/agent-core");
const shared_1 = require("../shared");
exports.stackingActions = [
    (0, shared_1.makeAction)({
        name: 'stacks_stacking_status',
        description: 'Get the current stacking (PoX) lock and delegation status for an address. ' +
            'Params: { address: string, network? }.',
        similes: ['STACKING_STATUS', 'POX_STATUS', 'CHECK_STACKING'],
        handler: agent_core_1.getStackingStatus,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_can_stack',
        description: 'Check whether an address can stack a given amount for a number of cycles. ' +
            'Params: { address, amount, cycles, poxAddress, network? }.',
        similes: ['CAN_STACK', 'STACKING_ELIGIBILITY'],
        handler: agent_core_1.canStack,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_stack',
        description: 'Lock STX for stacking (PoX). ' +
            'Params: { amount, cycles, poxAddress, senderKey, burnBlockHeight?, network? }.',
        similes: ['STACK_STX', 'LOCK_STX', 'START_STACKING'],
        handler: agent_core_1.stack,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_delegate_stx',
        description: 'Delegate STX to a stacking pool/operator. ' +
            'Params: { amount, delegateTo, senderKey, untilBurnBlockHeight?, poxAddress?, network? }.',
        similes: ['DELEGATE_STX', 'POOL_STACKING'],
        handler: agent_core_1.delegateStx,
    }),
    (0, shared_1.makeAction)({
        name: 'stacks_revoke_delegate',
        description: 'Revoke an active stacking delegation. Params: { senderKey, network? }.',
        similes: ['REVOKE_DELEGATION', 'UNDELEGATE_STX'],
        handler: agent_core_1.revokeDelegate,
    }),
];
