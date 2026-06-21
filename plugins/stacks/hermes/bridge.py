"""Node subprocess bridge to @stacks/agent-core for Hermes write tools."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

_SCRIPT = Path(__file__).resolve().parent / "scripts" / "stacks-write.mjs"
_REPO_ROOT = Path(__file__).resolve().parents[3]
_DEFAULT_TIMEOUT = 120.0

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


def run_ts_write(tool: str, params: dict, *, timeout: float = _DEFAULT_TIMEOUT) -> str:
    """Invoke stacks-write.mjs and return a JSON string for the Hermes handler."""
    if tool not in WRITE_TOOL_NAMES:
        return json.dumps({"success": False, "error": f"Not a write tool: {tool}"})

    node = shutil.which("node")
    if not node:
        return json.dumps(
            {
                "success": False,
                "error": "Node.js is required for write operations. Install Node 22+.",
            }
        )

    if not _SCRIPT.is_file():
        return json.dumps(
            {
                "success": False,
                "error": f"Write bridge script not found: {_SCRIPT}",
            }
        )

    payload = dict(params)
    if "senderKey" not in payload and os.environ.get("STACKS_SENDER_KEY"):
        payload["senderKey"] = os.environ["STACKS_SENDER_KEY"]

    try:
        proc = subprocess.run(
            [node, str(_SCRIPT), tool, json.dumps(payload)],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=str(_REPO_ROOT),
        )
    except subprocess.TimeoutExpired:
        return json.dumps({"success": False, "error": f"Write bridge timed out after {timeout}s"})
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
            "error": f"Write bridge exited with code {proc.returncode} and no output",
        }
    )
