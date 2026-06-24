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

# --- sBTC ---
SBTC_BALANCE_SCHEMA = {
    "name": "stacks_sbtc_get_balance",
    "description": (
        "Get sBTC balance for a Stacks address (8-decimal base units). Omit `address` for the agent wallet. "
        "Params: { address?, network? }."
    ),
    "parameters": _obj({"address": {"type": "string"}, "network": _NETWORK}),
}

SEND_SBTC_SCHEMA = {
    "name": "stacks_send_sbtc",
    "description": (
        "Transfer sBTC on Stacks via sbtc-token SIP-010. Recipient must differ from sender (no self-transfers). "
        "senderKey is auto-injected. Params: { recipient, amount, memo?, network? }."
    ),
    "parameters": _obj(
        {
            "recipient": {"type": "string"},
            "amount": {"type": "string", "description": "sBTC/BTC amount or base units"},
            "memo": {"type": "string"},
            "network": _NETWORK,
        },
        ["recipient", "amount"],
    ),
}

SBTC_BUILD_PEG_IN_SCHEMA = {
    "name": "stacks_sbtc_build_peg_in",
    "description": (
        "Build sBTC peg-in deposit address without broadcasting Bitcoin. "
        "Params: { stacksAddress?, maxSignerFee?, reclaimLockTime?, network? }."
    ),
    "parameters": _obj(
        {
            "stacksAddress": {"type": "string"},
            "maxSignerFee": {"type": "integer"},
            "reclaimLockTime": {"type": "integer"},
            "network": _NETWORK,
        }
    ),
}

SBTC_INITIATE_PEG_IN_SCHEMA = {
    "name": "stacks_sbtc_initiate_peg_in",
    "description": (
        "Peg BTC into sBTC: broadcast Bitcoin deposit and notify Emily. "
        "Requires BITCOIN_PRIVATE_KEY and BITCOIN_ADDRESS in env. "
        "Params: { amount, stacksAddress?, feeRate?, network? }."
    ),
    "parameters": _obj(
        {
            "amount": {"type": "string", "description": "BTC/sBTC amount or satoshis"},
            "stacksAddress": {"type": "string"},
            "feeRate": {"type": "number"},
            "maxSignerFee": {"type": "integer"},
            "network": _NETWORK,
        },
        ["amount"],
    ),
}

SBTC_INITIATE_PEG_OUT_SCHEMA = {
    "name": "stacks_sbtc_initiate_peg_out",
    "description": (
        "Initiate sBTC peg-out (withdraw sBTC for BTC). senderKey is auto-injected. "
        "Params: { amount, bitcoinRecipient, maxFee?, network? }."
    ),
    "parameters": _obj(
        {
            "amount": {"type": "string"},
            "bitcoinRecipient": {"type": "string"},
            "maxFee": {"type": "string"},
            "network": _NETWORK,
        },
        ["amount", "bitcoinRecipient"],
    ),
}

SBTC_PEG_STATUS_SCHEMA = {
    "name": "stacks_sbtc_get_peg_status",
    "description": (
        "Query Emily for peg-in deposit (bitcoinTxid) or peg-out withdrawals (stacksAddress). "
        "Params: { bitcoinTxid?, vout?, stacksAddress?, network? }."
    ),
    "parameters": _obj(
        {
            "bitcoinTxid": {"type": "string"},
            "vout": {"type": "integer"},
            "stacksAddress": {"type": "string"},
            "network": _NETWORK,
        }
    ),
}

# --- Zest ---
ZEST_VAULT_INFO_SCHEMA = {
    "name": "stacks_zest_sbtc_vault_info",
    "description": "Read Zest vault-sbtc utilization, borrow APR, and available liquidity. Params: { network? }.",
    "parameters": _obj({"network": _NETWORK}),
}

ZEST_PROTOCOL_STATUS_SCHEMA = {
    "name": "stacks_zest_protocol_status",
    "description": "Read Zest vault pause flags before attempting writes. Params: { network? }.",
    "parameters": _obj({"network": _NETWORK}),
}

ZEST_SUPPLY_SBTC_SCHEMA = {
    "name": "stacks_zest_supply_sbtc",
    "description": (
        "Supply sBTC to Zest vault-sbtc for yield. Check pause state first. senderKey is auto-injected. "
        "Params: { amount, minOut?, recipient?, network? }."
    ),
    "parameters": _obj(
        {
            "amount": {"type": "string"},
            "minOut": {"type": "string"},
            "recipient": {"type": "string"},
            "network": _NETWORK,
        },
        ["amount"],
    ),
}

ZEST_REDEEM_SBTC_SCHEMA = {
    "name": "stacks_zest_redeem_sbtc",
    "description": (
        "Redeem zsBTC shares from Zest vault-sbtc. senderKey is auto-injected. "
        "Params: { shares, minUnderlying?, recipient?, network? }."
    ),
    "parameters": _obj(
        {
            "shares": {"type": "string"},
            "minUnderlying": {"type": "string"},
            "recipient": {"type": "string"},
            "network": _NETWORK,
        },
        ["shares"],
    ),
}

ZEST_POSITION_SCHEMA = {
    "name": "stacks_zest_position",
    "description": (
        "Read Zest market position (collateral and debt) for a Stacks address. "
        "Params: { address?, network? }."
    ),
    "parameters": _obj({"address": {"type": "string"}, "network": _NETWORK}),
}

ZEST_COLLATERAL_ADD_SCHEMA = {
    "name": "stacks_zest_collateral_add_sbtc",
    "description": (
        "Post sBTC as Zest market collateral. senderKey is auto-injected. "
        "Params: { amount, assetContract?, priceFeedsHex?, network? }."
    ),
    "parameters": _obj(
        {
            "amount": {"type": "string"},
            "assetContract": {"type": "string"},
            "priceFeedsHex": {"type": "array", "items": {"type": "string"}},
            "network": _NETWORK,
        },
        ["amount"],
    ),
}

ZEST_BORROW_SCHEMA = {
    "name": "stacks_zest_borrow",
    "description": (
        "Borrow from Zest market against collateral. senderKey is auto-injected. "
        "Params: { assetContract, amount, receiver?, priceFeedsHex?, network? }."
    ),
    "parameters": _obj(
        {
            "assetContract": {"type": "string"},
            "amount": {"type": "string"},
            "receiver": {"type": "string"},
            "priceFeedsHex": {"type": "array", "items": {"type": "string"}},
            "network": _NETWORK,
        },
        ["assetContract", "amount"],
    ),
}

ZEST_REPAY_SCHEMA = {
    "name": "stacks_zest_repay",
    "description": (
        "Repay Zest market debt. senderKey is auto-injected. "
        "Params: { assetContract, amount, priceFeedsHex?, network? }."
    ),
    "parameters": _obj(
        {
            "assetContract": {"type": "string"},
            "amount": {"type": "string"},
            "priceFeedsHex": {"type": "array", "items": {"type": "string"}},
            "network": _NETWORK,
        },
        ["assetContract", "amount"],
    ),
}
