"""Stacks plugin for Hermes.

Registers the full Stacks agent toolset (balances, history, stacking, BNS,
contracts, swaps, bridging) so a Hermes agent can interact with the Stacks
blockchain. Read tools work out of the box; write tools require a signer.
"""

from . import schemas, tools

_TOOLS = [
    (schemas.BALANCE_SCHEMA, tools.get_balance),
    (schemas.SEND_SCHEMA, tools.send_tokens),
    (schemas.HISTORY_SCHEMA, tools.get_account_history),
    (schemas.STACKING_STATUS_SCHEMA, tools.stacking_status),
    (schemas.CAN_STACK_SCHEMA, tools.can_stack),
    (schemas.STACK_SCHEMA, tools.stack),
    (schemas.DELEGATE_SCHEMA, tools.delegate_stx),
    (schemas.REVOKE_DELEGATE_SCHEMA, tools.revoke_delegate),
    (schemas.RESOLVE_NAME_SCHEMA, tools.resolve_name),
    (schemas.LOOKUP_ADDRESS_SCHEMA, tools.lookup_address),
    (schemas.NAME_PRICE_SCHEMA, tools.get_name_price),
    (schemas.TRANSFER_NAME_SCHEMA, tools.transfer_name),
    (schemas.CONTRACT_CALL_SCHEMA, tools.contract_call),
    (schemas.READ_ONLY_SCHEMA, tools.read_only_call),
    (schemas.DECODE_CV_SCHEMA, tools.decode_cv),
    (schemas.SWAP_QUOTE_SCHEMA, tools.swap_quote),
    (schemas.SWAP_EXECUTE_SCHEMA, tools.swap_execute),
    (schemas.BRIDGE_QUOTE_SCHEMA, tools.bridge_quote),
    (schemas.BRIDGE_INITIATE_SCHEMA, tools.bridge_initiate),
]


def register(ctx):
    """Wire every Stacks tool into the Hermes runtime."""
    for schema, handler in _TOOLS:
        ctx.register_tool(
            name=schema["name"],
            toolset="stacks",
            schema=schema,
            handler=handler,
            description=schema["description"],
        )
