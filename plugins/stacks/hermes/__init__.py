"""Stacks plugin for Hermes.

Registers the full Stacks agent toolset (balances, history, stacking, BNS,
contracts, swaps, bridging) so a Hermes agent can interact with the Stacks
blockchain. All tools delegate to @sugarhi11/agent-core via the Node bridge.
"""

from __future__ import annotations

import logging
from pathlib import Path

from . import schemas, tools
from .shared import WRITE_TOOLS
from .wallet import has_sender_key, wallet_context_text

logger = logging.getLogger(__name__)

_CALL_LOG: list[dict[str, str]] = []

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

_STACKS_STATUS_HELP = """\
/stacks — Stacks wallet and network status

Shows the configured network, agent wallet address, and whether signing is
ready. Read-only tools work without STACKS_SENDER_KEY; write tools (send,
stack, delegate, contract calls, swaps, bridge) require it in ~/.hermes/.env.

Usage:
  /stacks          Show wallet/network status
  /stacks help     Show this help
"""


def _check_write_tools_available() -> bool:
    return has_sender_key()


def _on_post_tool_call(
    tool_name: str = "",
    args: dict | None = None,
    result: str = "",
    task_id: str = "",
    **_: object,
) -> None:
    """Log Stacks tool usage (fires for all tools; we filter to ours)."""
    if not tool_name.startswith("stacks_"):
        return
    _CALL_LOG.append({"tool": tool_name, "session": task_id})
    if len(_CALL_LOG) > 100:
        _CALL_LOG.pop(0)
    logger.debug("Stacks tool called: %s (session %s)", tool_name, task_id)


def _inject_wallet_context(is_first_turn: bool = False, **_: object) -> dict[str, str] | None:
    """Inject wallet/network context on the first turn of each session."""
    if not is_first_turn:
        return None
    return {"context": wallet_context_text()}


def _handle_stacks_status(raw_args: str) -> str:
    argv = raw_args.strip().split()
    if argv and argv[0] in {"help", "-h", "--help"}:
        return _STACKS_STATUS_HELP
    return wallet_context_text()


def register(ctx) -> None:
    """Wire every Stacks tool, hook, slash command, and bundled skill."""
    for schema, handler in _TOOLS:
        ctx.register_tool(
            name=schema["name"],
            toolset="stacks",
            schema=schema,
            handler=handler,
            description=schema["description"],
            check_fn=(
                _check_write_tools_available
                if schema["name"] in WRITE_TOOLS
                else None
            ),
        )

    ctx.register_hook("pre_llm_call", _inject_wallet_context)
    ctx.register_hook("post_tool_call", _on_post_tool_call)
    ctx.register_command(
        "stacks",
        handler=_handle_stacks_status,
        description="Show Stacks wallet/network status and signing readiness.",
    )

    skills_dir = Path(__file__).parent / "skills"
    if skills_dir.is_dir():
        for child in sorted(skills_dir.iterdir()):
            skill_md = child / "SKILL.md"
            if child.is_dir() and skill_md.is_file():
                ctx.register_skill(child.name, skill_md)
