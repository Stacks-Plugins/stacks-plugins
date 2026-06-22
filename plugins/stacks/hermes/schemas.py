"""JSON tool schemas exposed to the LLM for the Stacks Hermes plugin.

These mirror the Eliza plugin-stacks action surface so all three ecosystems
(ElizaOS, OpenClaw, Hermes) share an identical agent-facing contract.
"""

_NETWORK = {
    "type": "string",
    "enum": ["mainnet", "testnet"],
    "description": "Target network. Defaults to STACKS_NETWORK env (testnet).",
}


def _obj(properties, required=None):
    return {
        "type": "object",
        "properties": properties,
        "required": required or [],
    }


# --- Account ---
BALANCE_SCHEMA = {
    "name": "stacks_get_balance",
    "description": (
        "Look up STX and token balances on Stacks. Omit `address` to check the agent wallet. "
        "Params: { address?: string, network?: mainnet|testnet }."
    ),
    "parameters": _obj({"address": {"type": "string"}, "network": _NETWORK}),
}

SEND_SCHEMA = {
    "name": "stacks_send_tokens",
    "description": (
        "Send STX to another Stacks address. Amount can be in STX — converted automatically. "
        "Omit `senderKey` (injected from env). Confirm before sending. "
        "Params: { recipient: string, amount: string|number, memo?: string, network? }."
    ),
    "parameters": _obj(
        {
            "recipient": {"type": "string"},
            "amount": {"type": "string", "description": "Amount in STX or microSTX."},
            "memo": {"type": "string"},
            "network": _NETWORK,
        },
        ["recipient", "amount"],
    ),
}

HISTORY_SCHEMA = {
    "name": "stacks_get_account_history",
    "description": (
        "Fetch recent transactions for a Stacks address. Omit `address` for the agent wallet. "
        "Params: { address?: string, limit?: number, offset?: number, network? }."
    ),
    "parameters": _obj(
        {
            "address": {"type": "string"},
            "limit": {"type": "integer"},
            "offset": {"type": "integer"},
            "network": _NETWORK,
        }
    ),
}

# --- Stacking / PoX ---
STACKING_STATUS_SCHEMA = {
    "name": "stacks_stacking_status",
    "description": (
        "Get the current stacking (PoX) lock and delegation status for an address. "
        "Params: { address?: string, network? }."
    ),
    "parameters": _obj({"address": {"type": "string"}, "network": _NETWORK}),
}

CAN_STACK_SCHEMA = {
    "name": "stacks_can_stack",
    "description": (
        "Check whether an address can stack a given amount for a number of cycles. "
        "Params: { address, amount, cycles, poxAddress, network? }."
    ),
    "parameters": _obj(
        {
            "address": {"type": "string"},
            "amount": {"type": "string", "description": "STX or microSTX"},
            "cycles": {"type": "integer"},
            "poxAddress": {"type": "string"},
            "network": _NETWORK,
        },
        ["address", "amount", "cycles", "poxAddress"],
    ),
}

STACK_SCHEMA = {
    "name": "stacks_stack",
    "description": (
        "Lock STX for stacking (PoX). senderKey is auto-injected. "
        "Params: { amount, cycles, poxAddress, network? }."
    ),
    "parameters": _obj(
        {
            "amount": {"type": "string", "description": "STX or microSTX"},
            "cycles": {"type": "integer"},
            "poxAddress": {"type": "string"},
            "network": _NETWORK,
        },
        ["amount", "cycles", "poxAddress"],
    ),
}

DELEGATE_SCHEMA = {
    "name": "stacks_delegate_stx",
    "description": (
        "Delegate STX to a stacking pool/operator. senderKey is auto-injected. "
        "Params: { amount, delegateTo, untilBurnBlockHeight?, poxAddress?, network? }."
    ),
    "parameters": _obj(
        {
            "amount": {"type": "string", "description": "STX or microSTX"},
            "delegateTo": {"type": "string"},
            "untilBurnBlockHeight": {"type": "integer"},
            "poxAddress": {"type": "string"},
            "network": _NETWORK,
        },
        ["amount", "delegateTo"],
    ),
}

REVOKE_DELEGATE_SCHEMA = {
    "name": "stacks_revoke_delegate",
    "description": "Revoke an active stacking delegation. senderKey is auto-injected. Params: { network? }.",
    "parameters": _obj({"network": _NETWORK}),
}

# --- BNS ---
RESOLVE_NAME_SCHEMA = {
    "name": "stacks_resolve_name",
    "description": "Resolve a BNS name to its owner address and zonefile. Params: { name, network? }.",
    "parameters": _obj({"name": {"type": "string"}, "network": _NETWORK}, ["name"]),
}

LOOKUP_ADDRESS_SCHEMA = {
    "name": "stacks_lookup_address",
    "description": "List all BNS names owned by a Stacks address. Params: { address, network? }.",
    "parameters": _obj({"address": {"type": "string"}, "network": _NETWORK}, ["address"]),
}

NAME_PRICE_SCHEMA = {
    "name": "stacks_get_name_price",
    "description": "Get the registration price (microSTX) for a BNS name. Params: { name, network? }.",
    "parameters": _obj({"name": {"type": "string"}, "network": _NETWORK}, ["name"]),
}

TRANSFER_NAME_SCHEMA = {
    "name": "stacks_transfer_name",
    "description": (
        "Transfer ownership of a BNS name. senderKey is auto-injected. "
        "Params: { name, newOwnerAddress, zonefile?, network? }."
    ),
    "parameters": _obj(
        {
            "name": {"type": "string"},
            "newOwnerAddress": {"type": "string"},
            "zonefile": {"type": "string"},
            "network": _NETWORK,
        },
        ["name", "newOwnerAddress"],
    ),
}

# --- Contracts ---
CONTRACT_CALL_SCHEMA = {
    "name": "stacks_contract_call",
    "description": (
        "Sign and broadcast a public Clarity contract function call. senderKey is auto-injected. "
        "Params: { contractAddress, contractName, functionName, functionArgsHex?, network? }."
    ),
    "parameters": _obj(
        {
            "contractAddress": {"type": "string"},
            "contractName": {"type": "string"},
            "functionName": {"type": "string"},
            "functionArgsHex": {"type": "array", "items": {"type": "string"}},
            "network": _NETWORK,
        },
        ["contractAddress", "contractName", "functionName"],
    ),
}

READ_ONLY_SCHEMA = {
    "name": "stacks_read_only_call",
    "description": (
        "Evaluate a read-only Clarity contract function. "
        "Params: { contractAddress, contractName, functionName, functionArgsHex?, senderAddress?, network? }."
    ),
    "parameters": _obj(
        {
            "contractAddress": {"type": "string"},
            "contractName": {"type": "string"},
            "functionName": {"type": "string"},
            "functionArgsHex": {"type": "array", "items": {"type": "string"}},
            "senderAddress": {"type": "string"},
            "network": _NETWORK,
        },
        ["contractAddress", "contractName", "functionName"],
    ),
}

DECODE_CV_SCHEMA = {
    "name": "stacks_decode_cv",
    "description": "Decode a hex-encoded serialized Clarity value into readable JSON. Params: { hex }.",
    "parameters": _obj({"hex": {"type": "string"}}, ["hex"]),
}

# --- Swaps & Bridge ---
SWAP_QUOTE_SCHEMA = {
    "name": "stacks_swap_quote",
    "description": "Get a token swap quote from the ALEX DEX (mainnet). Params: { tokenFrom, tokenTo, amount }.",
    "parameters": _obj(
        {
            "tokenFrom": {"type": "string"},
            "tokenTo": {"type": "string"},
            "amount": {"type": "string"},
        },
        ["tokenFrom", "tokenTo", "amount"],
    ),
}

SWAP_EXECUTE_SCHEMA = {
    "name": "stacks_swap_execute",
    "description": (
        "Execute a token swap on the ALEX DEX. senderKey is auto-injected. "
        "Params: { tokenFrom, tokenTo, amount, minAmountOut, network? }."
    ),
    "parameters": _obj(
        {
            "tokenFrom": {"type": "string"},
            "tokenTo": {"type": "string"},
            "amount": {"type": "string"},
            "minAmountOut": {"type": "string"},
            "network": _NETWORK,
        },
        ["tokenFrom", "tokenTo", "amount", "minAmountOut"],
    ),
}

BRIDGE_QUOTE_SCHEMA = {
    "name": "stacks_bridge_quote",
    "description": "Get a cross-chain bridge quote via Allbridge Core. Params: { fromChain, toChain, token, amount }.",
    "parameters": _obj(
        {
            "fromChain": {"type": "string"},
            "toChain": {"type": "string"},
            "token": {"type": "string"},
            "amount": {"type": "string"},
        },
        ["fromChain", "toChain", "token", "amount"],
    ),
}

BRIDGE_INITIATE_SCHEMA = {
    "name": "stacks_bridge_initiate",
    "description": (
        "Initiate a cross-chain bridge transfer. senderKey is auto-injected. "
        "Params: { fromChain, toChain, token, amount, recipient, network? }."
    ),
    "parameters": _obj(
        {
            "fromChain": {"type": "string"},
            "toChain": {"type": "string"},
            "token": {"type": "string"},
            "amount": {"type": "string"},
            "recipient": {"type": "string"},
            "network": _NETWORK,
        },
        ["fromChain", "toChain", "token", "amount", "recipient"],
    ),
}
