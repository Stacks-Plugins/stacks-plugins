import {
  canStack,
  delegateStx,
  getStackingStatus,
  revokeDelegate,
  stack,
} from '@stacks/agent-core';
import type { Action } from '@elizaos/core';
import { makeAction } from '../shared';

export const stackingActions: Action[] = [
  makeAction({
    name: 'stacks_stacking_status',
    description:
      'Get the current stacking (PoX) lock and delegation status for an address. ' +
      'Params: { address: string, network? }.',
    similes: ['STACKING_STATUS', 'POX_STATUS', 'CHECK_STACKING'],
    handler: getStackingStatus,
  }),
  makeAction({
    name: 'stacks_can_stack',
    description:
      'Check whether an address can stack a given amount for a number of cycles. ' +
      'Params: { address, amount, cycles, poxAddress, network? }.',
    similes: ['CAN_STACK', 'STACKING_ELIGIBILITY'],
    handler: canStack,
  }),
  makeAction({
    name: 'stacks_stack',
    description:
      'Lock STX for stacking (PoX). ' +
      'Params: { amount, cycles, poxAddress, senderKey, burnBlockHeight?, network? }.',
    similes: ['STACK_STX', 'LOCK_STX', 'START_STACKING'],
    handler: stack,
  }),
  makeAction({
    name: 'stacks_delegate_stx',
    description:
      'Delegate STX to a stacking pool/operator. ' +
      'Params: { amount, delegateTo, senderKey, untilBurnBlockHeight?, poxAddress?, network? }.',
    similes: ['DELEGATE_STX', 'POOL_STACKING'],
    handler: delegateStx,
  }),
  makeAction({
    name: 'stacks_revoke_delegate',
    description: 'Revoke an active stacking delegation. Params: { senderKey, network? }.',
    similes: ['REVOKE_DELEGATION', 'UNDELEGATE_STX'],
    handler: revokeDelegate,
  }),
];
