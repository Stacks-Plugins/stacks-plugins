"""Parameter normalization for Hermes Stacks tools."""

from __future__ import annotations

from typing import Any


def parse_stx_amount(amount: str | int | float | None) -> str | None:
    if amount is None or amount == "":
        return None

    if isinstance(amount, (int, float)):
        if not isinstance(amount, bool):
            if isinstance(amount, float) and not (amount == amount):  # NaN
                return None
            if isinstance(amount, int) and amount >= 1_000_000:
                return str(amount)
            return str(int(round(float(amount) * 1_000_000)))

    raw = str(amount).strip().lower().replace(",", "").replace("stx", "").strip()
    if not raw:
        return None

    if raw.isdigit() and len(raw) >= 7:
        return raw

    try:
        parsed = float(raw)
    except ValueError:
        return None

    if parsed >= 1_000_000 and parsed == int(parsed):
        return str(int(parsed))
    return str(int(round(parsed * 1_000_000)))


def normalize_send_params(params: dict[str, Any]) -> dict[str, Any]:
    out = dict(params)

    if not out.get("recipient"):
        out["recipient"] = (
            out.get("to")
            or out.get("toAddress")
            or out.get("recipientAddress")
            or out.get("destination")
        )

    if out.get("amount") is None:
        out["amount"] = out.get("stxAmount") or out.get("stx") or out.get("value") or out.get("quantity")

    if isinstance(out.get("amount"), dict):
        nested = out["amount"]
        out["amount"] = nested.get("amount") or nested.get("value") or nested.get("stx")

    for key in ("to", "toAddress", "recipientAddress", "destination", "stxAmount", "stx", "value", "quantity"):
        out.pop(key, None)

    for key in ("fee", "nonce"):
        if out.get(key) in ("", None):
            out.pop(key, None)

    return out


def require_send_params(params: dict[str, Any]) -> None:
    if not params.get("recipient"):
        raise ValueError(
            "Missing recipient address. Provide `recipient` with a valid Stacks address."
        )
    if params.get("amount") is None:
        raise ValueError("Missing amount. Provide `amount` in STX or microSTX.")
    if not parse_stx_amount(params["amount"]):
        raise ValueError(f"Could not parse STX amount: {params['amount']}")
