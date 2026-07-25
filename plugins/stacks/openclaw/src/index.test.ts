import { describe, expect, it } from 'vitest';
import entry from './index.js';
import { getToolPluginMetadata } from 'openclaw/plugin-sdk/tool-plugin';

const EXPECTED_TOOLS = [
  'stacks_wallet_info',
  'stacks_get_balance',
  'stacks_send_tokens',
  'stacks_get_account_history',
  'stacks_stacking_status',
  'stacks_can_stack',
  'stacks_stack',
  'stacks_delegate_stx',
  'stacks_revoke_delegate',
  'stacks_resolve_name',
  'stacks_lookup_address',
  'stacks_get_name_price',
  'stacks_transfer_name',
  'stacks_contract_call',
  'stacks_read_only_call',
  'stacks_decode_cv',
  'stacks_swap_quote',
  'stacks_swap_execute',
  'stacks_bridge_quote',
  'stacks_bridge_initiate',
  'stacks_sbtc_get_balance',
  'stacks_send_sbtc',
  'stacks_sbtc_build_peg_in',
  'stacks_sbtc_initiate_peg_in',
  'stacks_sbtc_initiate_peg_out',
  'stacks_sbtc_get_peg_status',
  'stacks_zest_sbtc_vault_info',
  'stacks_zest_protocol_status',
  'stacks_zest_supply_sbtc',
  'stacks_zest_redeem_sbtc',
  'stacks_zest_position',
  'stacks_zest_collateral_add_sbtc',
  'stacks_zest_borrow',
  'stacks_zest_repay',
];

describe('stacks', () => {
  it('declares tool metadata', () => {
    expect(getToolPluginMetadata(entry)?.tools.map((tool) => tool.name)).toEqual(EXPECTED_TOOLS);
  });

  it('marks write tools as optional', () => {
    const metadata = getToolPluginMetadata(entry);
    const optional = new Set(
      metadata?.tools.filter((tool) => tool.optional).map((tool) => tool.name) ?? []
    );
    expect(optional).toEqual(
      new Set([
        'stacks_send_tokens',
        'stacks_stack',
        'stacks_delegate_stx',
        'stacks_revoke_delegate',
        'stacks_transfer_name',
        'stacks_contract_call',
        'stacks_swap_execute',
        'stacks_bridge_initiate',
        'stacks_send_sbtc',
        'stacks_sbtc_initiate_peg_in',
        'stacks_sbtc_initiate_peg_out',
        'stacks_zest_supply_sbtc',
        'stacks_zest_redeem_sbtc',
        'stacks_zest_collateral_add_sbtc',
        'stacks_zest_borrow',
        'stacks_zest_repay',
      ])
    );
  });
});
