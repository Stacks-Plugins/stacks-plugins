"""Node subprocess bridge to @sugarhi11/agent-core for all Hermes Stacks tools."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

_SCRIPT = Path(__file__).resolve().parent / "scripts" / "stacks-bridge.mjs"
_HERMES_ROOT = Path(__file__).resolve().parent
_DEFAULT_TIMEOUT = 120.0

# Backward-compatible alias used by older imports.
WRITE_TOOL_NAMES = frozenset(
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


def run_ts_tool(tool: str, params: dict, *, timeout: float = _DEFAULT_TIMEOUT) -> str:
    """Invoke stacks-bridge.mjs and return a JSON string for the Hermes handler."""
    node = shutil.which("node")
    if not node:
        return json.dumps(
            {
                "success": False,
                "error": "Node.js is required for Stacks tools. Install Node 22+ and run npm install in plugins/stacks/.",
            }
        )

    if not _SCRIPT.is_file():
        return json.dumps(
            {
                "success": False,
                "error": f"Bridge script not found: {_SCRIPT}",
            }
        )

    payload = dict(params)
    if not payload.get("network") and os.environ.get("STACKS_NETWORK"):
        payload["network"] = os.environ["STACKS_NETWORK"]

    try:
        proc = subprocess.run(
            [node, str(_SCRIPT), tool, json.dumps(payload)],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=str(_HERMES_ROOT),
        )
    except subprocess.TimeoutExpired:
        return json.dumps({"success": False, "error": f"Stacks bridge timed out after {timeout}s"})
    except OSError as exc:
        return json.dumps({"success": False, "error": str(exc)})

    stdout = (proc.stdout or "").strip()
    stderr = (proc.stderr or "").strip()

    if stdout:
        try:
            parsed = json.loads(stdout)
            if isinstance(parsed, dict) and "success" in parsed:
                return stdout
        except json.JSONDecodeError:
            pass
        return json.dumps({"success": proc.returncode == 0, "result": stdout, "stderr": stderr})

    if stderr:
        try:
            parsed = json.loads(stderr)
            if isinstance(parsed, dict):
                return stderr
        except json.JSONDecodeError:
            pass
        return json.dumps({"success": False, "error": stderr})

    return json.dumps(
        {
            "success": False,
            "error": f"Stacks bridge exited with code {proc.returncode} and no output",
        }
    )


def run_ts_write(tool: str, params: dict, *, timeout: float = _DEFAULT_TIMEOUT) -> str:
    """Backward-compatible alias for write tools."""
    return run_ts_tool(tool, params, timeout=timeout)
