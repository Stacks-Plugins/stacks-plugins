"""Tool handlers for the Stacks Hermes plugin.

All operations delegate to @sugarhi11/agent-core through the Node bridge,
with the same param enrichment and formatting behavior as the Eliza plugin.
"""

from __future__ import annotations

from .shared import run_tool


def _handler(tool_name: str):
    def handler(args: dict, **kwargs) -> str:
        return run_tool(tool_name, args)

    handler.__name__ = tool_name
    return handler


get_balance = _handler("stacks_get_balance")
send_tokens = _handler("stacks_send_tokens")
get_account_history = _handler("stacks_get_account_history")
stacking_status = _handler("stacks_stacking_status")
can_stack = _handler("stacks_can_stack")
stack = _handler("stacks_stack")
delegate_stx = _handler("stacks_delegate_stx")
revoke_delegate = _handler("stacks_revoke_delegate")
resolve_name = _handler("stacks_resolve_name")
lookup_address = _handler("stacks_lookup_address")
get_name_price = _handler("stacks_get_name_price")
transfer_name = _handler("stacks_transfer_name")
contract_call = _handler("stacks_contract_call")
read_only_call = _handler("stacks_read_only_call")
decode_cv = _handler("stacks_decode_cv")
swap_quote = _handler("stacks_swap_quote")
swap_execute = _handler("stacks_swap_execute")
bridge_quote = _handler("stacks_bridge_quote")
bridge_initiate = _handler("stacks_bridge_initiate")
