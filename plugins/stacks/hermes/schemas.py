"""JSON tool schemas exposed to the LLM for the Stacks Hermes plugin.

These mirror the tool surface of `@stacks/agent-core` so the three ecosystems
(ElizaOS, OpenClaw, Hermes) share an identical agent-facing contract.
"""

_NETWORK = {
    "type": "string",
    "enum": ["mainnet", "testnet"],
    "description": "Target network. Defaults to mainnet.",
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
    "description": "Get STX, fungible, and non-fungible token balances for a Stacks address.",
    "parameters": _obj(
        {"address": {"type": "string"}, "network": _NETWORK},
        ["address"],
    ),
}

SEND_SCHEMA = {
    "name": "stacks_send_tokens",
    "description": "Sign and broadcast an STX transfer (requires a configured signer).",
    "parameters": _obj(
        {
            "recipient": {"type": "string"},
            "amount": {"type": "string", "description": "Amount in microSTX."},
            "memo": {"type": "string"},
            "network": _NETWORK,
        },
        ["recipient", "amount"],
    ),
}

HISTORY_SCHEMA = {
    "name": "stacks_get_account_history",
    "description": "Get paginated transaction history for a Stacks address.",
    "parameters": _obj(
        {
            "address": {"type": "string"},
            "limit": {"type": "integer"},
            "offset": {"type": "integer"},
            "network": _NETWORK,
        },
        ["address"],
    ),
}

# --- Stacking / PoX ---
STACKING_STATUS_SCHEMA = {
    "name": "stacks_stacking_status",
    "description": "Get the current stacking (PoX) lock status for an address.",
    "parameters": _obj(
        {"address": {"type": "string"}, "network": _NETWORK},
        ["address"],
    ),
}

CAN_STACK_SCHEMA = {
    "name": "stacks_can_stack",
    "description": "Check whether an address can stack a given amount for a number of cycles.",
    "parameters": _obj(
        {
            "address": {"type": "string"},
            "amount": {"type": "string", "description": "microSTX"},
            "cycles": {"type": "integer"},
            "poxAddress": {"type": "string"},
            "network": _NETWORK,
        },
        ["address", "amount", "cycles", "poxAddress"],
    ),
}

STACK_SCHEMA = {
    "name": "stacks_stack",
    "description": "Lock STX for stacking (PoX). Requires a configured signer.",
    "parameters": _obj(
        {
            "amount": {"type": "string", "description": "microSTX"},
            "cycles": {"type": "integer"},
            "poxAddress": {"type": "string"},
            "network": _NETWORK,
        },
        ["amount", "cycles", "poxAddress"],
    ),
}

DELEGATE_SCHEMA = {
    "name": "stacks_delegate_stx",
    "description": "Delegate STX to a stacking pool/operator. Requires a configured signer.",
    "parameters": _obj(
        {
            "amount": {"type": "string", "description": "microSTX"},
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
    "description": "Revoke an active stacking delegation. Requires a configured signer.",
    "parameters": _obj({"network": _NETWORK}),
}

# --- BNS ---
RESOLVE_NAME_SCHEMA = {
    "name": "stacks_resolve_name",
    "description": "Resolve a BNS name to its owner address and zonefile.",
    "parameters": _obj(
        {"name": {"type": "string"}, "network": _NETWORK},
        ["name"],
    ),
}

LOOKUP_ADDRESS_SCHEMA = {
    "name": "stacks_lookup_address",
    "description": "List all BNS names owned by a Stacks address.",
    "parameters": _obj(
        {"address": {"type": "string"}, "network": _NETWORK},
        ["address"],
    ),
}

NAME_PRICE_SCHEMA = {
    "name": "stacks_get_name_price",
    "description": "Get the registration price (microSTX) for a BNS name.",
    "parameters": _obj(
        {"name": {"type": "string"}, "network": _NETWORK},
        ["name"],
    ),
}

TRANSFER_NAME_SCHEMA = {
    "name": "stacks_transfer_name",
    "description": "Transfer ownership of a BNS name. Requires a configured signer.",
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
    "description": "Sign and broadcast a public Clarity contract function call. Requires a signer.",
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
    "description": "Evaluate a read-only Clarity contract function.",
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
    "description": "Decode a hex-encoded serialized Clarity value via the Hiro API.",
    "parameters": _obj({"hex": {"type": "string"}}, ["hex"]),
}

# --- Swaps & Bridge ---
SWAP_QUOTE_SCHEMA = {
    "name": "stacks_swap_quote",
    "description": "Get a token swap quote from the ALEX DEX (mainnet).",
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
    "description": "Execute a token swap on ALEX. Requires a configured signer.",
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
    "description": "Get a cross-chain bridge quote via Allbridge Core.",
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
    "description": "Initiate a cross-chain bridge transfer. Requires a configured signer.",
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
