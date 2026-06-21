"""Tool handlers for the Stacks Hermes plugin.

Read operations call the Hiro API directly via httpx. Write operations delegate
to @stacks/agent-core through the Node subprocess bridge (see bridge.py).
"""

import json
import os

import httpx

try:
    from .bridge import run_ts_write
except ImportError:
    from bridge import run_ts_write

_TIMEOUT = 15.0

ALEX_API = "https://api.alexgo.io"
ALLBRIDGE_API = "https://core.api.allbridgecoreapi.net"


def _base_url(network: str) -> str:
    return "https://api.hiro.so" if network == "mainnet" else "https://api.testnet.hiro.so"


def _network(params: dict) -> str:
    return params.get("network") or os.environ.get("STACKS_NETWORK") or "mainnet"


def _ok(data) -> str:
    return json.dumps({"success": True, "result": data})


def _err(message: str) -> str:
    return json.dumps({"success": False, "error": message})


def _get(url: str) -> dict:
    resp = httpx.get(url, timeout=_TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def _post(url: str, body: dict) -> dict:
    resp = httpx.post(url, json=body, timeout=_TIMEOUT)
    resp.raise_for_status()
    return resp.json()



def _write(tool: str, params: dict) -> str:
    return run_ts_write(tool, params)


# --- Account ---
def get_balance(params, **_):
    try:
        net = _network(params)
        data = _get(f"{_base_url(net)}/extended/v1/address/{params['address']}/balances")
        return _ok(
            {
                "address": params["address"],
                "network": net,
                "stx": data.get("stx", {}).get("balance", "0"),
                "locked": data.get("stx", {}).get("locked", "0"),
                "fungibleTokens": data.get("fungible_tokens", {}),
                "nonFungibleTokens": data.get("non_fungible_tokens", {}),
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def get_account_history(params, **_):
    try:
        net = _network(params)
        limit = min(int(params.get("limit", 20)), 50)
        offset = int(params.get("offset", 0))
        url = (
            f"{_base_url(net)}/extended/v2/addresses/{params['address']}/transactions"
            f"?limit={limit}&offset={offset}"
        )
        data = _get(url)
        return _ok(
            {
                "address": params["address"],
                "network": net,
                "total": data.get("total", 0),
                "transactions": data.get("results", []),
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def send_tokens(params, **_):
    return _write("stacks_send_tokens", params)


# --- Stacking / PoX ---
def stacking_status(params, **_):
    try:
        net = _network(params)
        base = _base_url(net)
        pox = _get(f"{base}/v2/pox")
        account = _get(f"{base}/v2/accounts/{params['address']}?proof=0")
        return _ok(
            {
                "address": params["address"],
                "network": net,
                "currentCycle": pox.get("current_cycle", {}).get("id"),
                "nextCycle": pox.get("next_cycle", {}).get("id"),
                "minThresholdUstx": pox.get("next_cycle", {}).get("min_threshold_ustx"),
                "locked": account.get("locked", "0"),
                "unlockHeight": account.get("unlock_height", 0),
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def can_stack(params, **_):
    try:
        net = _network(params)
        base = _base_url(net)
        pox = _get(f"{base}/v2/pox")
        account = _get(f"{base}/v2/accounts/{params['address']}?proof=0")
        balance = int(account.get("balance", "0x0"), 16) if str(
            account.get("balance", "0")
        ).startswith("0x") else int(account.get("balance", 0))
        min_threshold = int(pox.get("next_cycle", {}).get("min_threshold_ustx", 0))
        eligible = balance >= int(params["amount"]) and int(params["amount"]) >= min_threshold
        return _ok(
            {
                "address": params["address"],
                "network": net,
                "eligible": eligible,
                "minThresholdUstx": min_threshold,
                "balance": balance,
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def stack(params, **_):
    return _write("stacks_stack", params)


def delegate_stx(params, **_):
    return _write("stacks_delegate_stx", params)


def revoke_delegate(params, **_):
    return _write("stacks_revoke_delegate", params)


# --- BNS ---
def resolve_name(params, **_):
    try:
        net = _network(params)
        try:
            data = _get(f"{_base_url(net)}/v1/names/{params['name']}")
        except httpx.HTTPStatusError as http_exc:
            if http_exc.response.status_code == 404:
                return _ok({"name": params["name"], "network": net, "found": False})
            raise
        return _ok(
            {
                "name": params["name"],
                "network": net,
                "found": True,
                "address": data.get("address"),
                "zonefile": data.get("zonefile"),
                "expireBlock": data.get("expire_block"),
                "status": data.get("status"),
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def lookup_address(params, **_):
    try:
        net = _network(params)
        data = _get(f"{_base_url(net)}/v1/addresses/stacks/{params['address']}")
        return _ok({"address": params["address"], "network": net, "names": data.get("names", [])})
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def get_name_price(params, **_):
    try:
        net = _network(params)
        data = _get(f"{_base_url(net)}/v2/prices/names/{params['name']}")
        return _ok(
            {
                "name": params["name"],
                "network": net,
                "amount": str(data.get("amount", "0")),
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def transfer_name(params, **_):
    return _write("stacks_transfer_name", params)


# --- Contracts ---
def contract_call(params, **_):
    return _write("stacks_contract_call", params)


def read_only_call(params, **_):
    try:
        net = _network(params)
        base = _base_url(net)
        sender = params.get("senderAddress") or params["contractAddress"]
        url = (
            f"{base}/v2/contracts/call-read/"
            f"{params['contractAddress']}/{params['contractName']}/{params['functionName']}"
        )
        body = {"sender": sender, "arguments": params.get("functionArgsHex", [])}
        data = _post(url, body)
        return _ok({"okay": data.get("okay"), "result": data.get("result"), "cause": data.get("cause")})
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def decode_cv(params, **_):
    """Decode a serialized Clarity value via the Hiro API helper endpoint."""
    try:
        # The read-only API echoes/parses hex; for standalone decoding we expose
        # the raw hex plus guidance, since full decoding needs a Clarity parser.
        return _ok(
            {
                "hex": params["hex"],
                "note": "For full decoding use stacks_read_only_call or the TS decodeCv tool.",
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


# --- Swaps & Bridge ---
def swap_quote(params, **_):
    try:
        url = (
            f"{ALEX_API}/v1/price/{params['tokenFrom']}/{params['tokenTo']}"
            f"?amount={params['amount']}"
        )
        data = _get(url)
        return _ok(
            {
                "tokenFrom": params["tokenFrom"],
                "tokenTo": params["tokenTo"],
                "amountIn": str(params["amount"]),
                "amountOut": str(data.get("amountOut", data.get("price", "0"))),
                "route": data.get("route", [params["tokenFrom"], params["tokenTo"]]),
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def swap_execute(params, **_):
    return _write("stacks_swap_execute", params)


def bridge_quote(params, **_):
    try:
        url = (
            f"{ALLBRIDGE_API}/swap?amount={params['amount']}"
            f"&fromChain={params['fromChain']}&toChain={params['toChain']}"
            f"&token={params['token']}"
        )
        data = _get(url)
        return _ok(
            {
                "fromChain": params["fromChain"],
                "toChain": params["toChain"],
                "token": params["token"],
                "amountIn": str(params["amount"]),
                "amountOut": str(data.get("amountOut", data.get("amount", "0"))),
                "fee": str(data.get("fee", "0")),
                "provider": "allbridge-core",
            }
        )
    except Exception as exc:  # noqa: BLE001
        return _err(str(exc))


def bridge_initiate(params, **_):
    return _write("stacks_bridge_initiate", params)
