"""Stacks wallet configuration for the Hermes plugin."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

_HERMES_ROOT = Path(__file__).resolve().parent

MY_ADDRESS_ALIASES = frozenset(
    {
        "my",
        "me",
        "mine",
        "my wallet",
        "my address",
        "my account",
        "configured wallet",
        "agent wallet",
    }
)


def get_network() -> str:
    return os.environ.get("STACKS_NETWORK", "testnet").strip() or "testnet"


def has_sender_key() -> bool:
    return bool(os.environ.get("STACKS_SENDER_KEY", "").strip())


def _derive_address_from_key(key: str, network: str) -> str | None:
    node = shutil.which("node")
    if not node:
        return None
    script = (
        "const { privateKeyToAddress } = require('@stacks/transactions');"
        "console.log(privateKeyToAddress(process.argv[1], process.argv[2]));"
    )
    try:
        proc = subprocess.run(
            [node, "-e", script, key, network],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=str(_HERMES_ROOT),
        )
        if proc.returncode == 0 and proc.stdout.strip():
            return proc.stdout.strip()
    except (OSError, subprocess.TimeoutExpired):
        pass
    return None


def get_wallet_address() -> str | None:
    address = os.environ.get("STACKS_WALLET_ADDRESS", "").strip()
    if address:
        return address
    key = os.environ.get("STACKS_SENDER_KEY", "").strip()
    if key:
        return _derive_address_from_key(key, get_network())
    return None


def resolve_address(address: str | None = None) -> str | None:
    if not address or not str(address).strip():
        return get_wallet_address()
    normalized = str(address).strip().lower()
    if normalized in MY_ADDRESS_ALIASES:
        return get_wallet_address()
    return str(address).strip()


def wallet_context_text() -> str:
    network = get_network()
    address = get_wallet_address()
    has_key = has_sender_key()
    lines = [
        f"Network: {network}",
        f"Agent wallet address: {address}" if address else "Agent wallet address: not configured",
        (
            "Signing: ready (STACKS_SENDER_KEY is set server-side — never ask the user for a private key)"
            if has_key
            else "Signing: not configured (read-only queries only until STACKS_SENDER_KEY is set)"
        ),
        "",
        'When the user says "my balance", "my wallet", or "send STX", use the agent wallet address above.',
        "For stacks_get_balance you may omit `address` to use the agent wallet.",
        "For write tools omit `senderKey` — it is injected automatically. Confirm sends before broadcasting.",
        "Amounts: users speak in STX (e.g. 1 STX = 1000000 microSTX). Convert before calling send.",
    ]
    return "\n".join(lines)
