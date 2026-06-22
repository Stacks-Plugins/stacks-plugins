"""Shared enrichment and execution helpers for Hermes Stacks tools."""

from __future__ import annotations

import json
import os
from typing import Any

from .formatters import format_tool_result
from .params import normalize_send_params, parse_stx_amount, require_send_params
from .wallet import get_network, has_sender_key, resolve_address
from .bridge import run_ts_tool

WRITE_TOOLS = frozenset(
    {
        "stacks_send_tokens",
        "stacks_stack",
        "stacks_delegate_stx",
        "stacks_revoke_delegate",
        "stacks_transfer_name",
        "stacks_contract_call",
        "stacks_swap_execute",
        "stacks_bridge_initiate",
    }
)

PARSE_AMOUNT_TOOLS = frozenset(
    {
        "stacks_send_tokens",
        "stacks_stack",
        "stacks_delegate_stx",
        "stacks_can_stack",
    }
)

OPTIONAL_ADDRESS_TOOLS = frozenset(
    {
        "stacks_get_balance",
        "stacks_get_account_history",
        "stacks_stacking_status",
    }
)


def enrich_params(tool_name: str, params: dict[str, Any]) -> dict[str, Any]:
    enriched = normalize_send_params(params) if tool_name == "stacks_send_tokens" else dict(params)

    if not enriched.get("network"):
        enriched["network"] = get_network()

    if "address" in enriched or tool_name in OPTIONAL_ADDRESS_TOOLS:
        resolved = resolve_address(enriched.get("address"))
        if resolved:
            enriched["address"] = resolved
        elif tool_name in {"stacks_get_balance", "stacks_get_account_history"}:
            raise ValueError(
                "No wallet address configured. Set STACKS_SENDER_KEY or STACKS_WALLET_ADDRESS in .env."
            )

    if tool_name in WRITE_TOOLS:
        if not enriched.get("senderKey") and has_sender_key():
            enriched["senderKey"] = os.environ["STACKS_SENDER_KEY"]
        if not enriched.get("senderKey"):
            raise ValueError(
                "No signing key configured. Set STACKS_SENDER_KEY in .env for sends and other write actions."
            )

    if tool_name in PARSE_AMOUNT_TOOLS and enriched.get("amount") is not None:
        micro = parse_stx_amount(enriched["amount"])
        if not micro:
            raise ValueError(f"Could not parse STX amount: {enriched['amount']}")
        enriched["amount"] = micro

    if tool_name == "stacks_send_tokens":
        require_send_params(enriched)

    return enriched


def run_tool(tool_name: str, params: dict[str, Any]) -> str:
    try:
        enriched = enrich_params(tool_name, params)
        raw = run_ts_tool(tool_name, enriched)
        parsed = json.loads(raw)
        if not parsed.get("success"):
            return json.dumps(parsed)

        result = parsed.get("result")
        text = format_tool_result(tool_name, result, enriched.get("network", get_network()))
        return json.dumps({"success": True, "result": result, "text": text})
    except Exception as exc:  # noqa: BLE001
        return json.dumps({"success": False, "error": str(exc)})
