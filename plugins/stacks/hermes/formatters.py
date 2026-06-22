"""Human-readable formatters for Hermes Stacks tool output."""

from __future__ import annotations

from typing import Any


def format_micro_stx(micro_stx: str | int) -> str:
    try:
        micro = int(micro_stx)
    except (TypeError, ValueError):
        return str(micro_stx)
    stx = micro / 1_000_000
    return f"{stx:,.6f} STX ({micro} microSTX)"


def _explorer_tx_url(txid: str, network: str) -> str:
    tx_id = txid[2:] if txid.startswith("0x") else txid
    base = f"https://explorer.hiro.so/txid/{tx_id}"
    return f"{base}?chain=testnet" if network == "testnet" else base


def format_account_history(result: dict[str, Any]) -> str:
    network = result.get("network", "testnet")
    txs = result.get("transactions") or []
    lines = [
        f"Transaction history for {result.get('address')} ({network})",
        f"Showing {len(txs)} of {result.get('total', len(txs))} total",
        "",
    ]

    if not txs:
        lines.append("No transactions found.")
        return "\n".join(lines)

    for index, raw in enumerate(txs, start=1):
        tx = raw.get("tx") if isinstance(raw, dict) else raw
        tx = tx or raw
        txid = (tx or {}).get("tx_id", "unknown")
        lines.append(f"{index}. TxID: {txid}")
        if isinstance(tx, dict):
            lines.append(f"   Type: {tx.get('tx_type', 'unknown')}")
            lines.append(f"   Status: {tx.get('tx_status', 'unknown')}")
            if tx.get("block_time_iso"):
                lines.append(f"   Time: {tx['block_time_iso']}")
        if txid != "unknown":
            lines.append(f"   Explorer: {_explorer_tx_url(txid, network)}")
        lines.append("")

    lines.append("Use only these TxIDs — do not invent or modify transaction data.")
    return "\n".join(lines)


def format_balance(result: dict[str, Any]) -> str:
    lines = [
        f"Balance for {result.get('address')} ({result.get('network')})",
        f"Spendable: {format_micro_stx(result.get('stx', '0'))}",
        f"Locked (stacking): {format_micro_stx(result.get('locked', '0'))}",
    ]
    tokens = (result.get("fungibleTokens") or {}).items()
    token_list = list(tokens)[:5]
    if token_list:
        lines.append("")
        lines.append("Fungible tokens:")
        for token_id, data in token_list:
            balance = data.get("balance") if isinstance(data, dict) else data
            lines.append(f"  {token_id}: {balance}")
    return "\n".join(lines)


def format_send_result(result: dict[str, Any], network: str) -> str:
    if result.get("success") and result.get("txid"):
        txid = result["txid"]
        tx_id = txid[2:] if txid.startswith("0x") else txid
        explorer = (
            f"https://explorer.hiro.so/txid/{tx_id}?chain=testnet"
            if network == "testnet"
            else f"https://explorer.hiro.so/txid/{tx_id}"
        )
        return f"Transfer submitted successfully.\nTxID: {txid}\nExplorer: {explorer}"
    err = result.get("error", "unknown")
    reason = result.get("reason")
    suffix = f" ({reason})" if reason else ""
    return f"Transfer failed: {err}{suffix}"


def format_tool_result(tool_name: str, result: Any, network: str) -> str:
    if tool_name == "stacks_get_balance" and isinstance(result, dict):
        return format_balance(result)
    if tool_name == "stacks_send_tokens" and isinstance(result, dict):
        return format_send_result(result, network)
    if tool_name == "stacks_get_account_history" and isinstance(result, dict):
        return format_account_history(result)
    if isinstance(result, str):
        return result
    import json

    return json.dumps(result, indent=2)
