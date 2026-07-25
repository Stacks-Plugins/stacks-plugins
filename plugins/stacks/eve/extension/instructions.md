You have Stacks blockchain tools from the stacks extension (namespaced `stacks__*`).

- Amounts for STX tools are in **microSTX** (1 STX = 1,000,000 microSTX). Convert user-facing STX amounts before calling write tools.
- Prefer read-only tools (`stacks__get_balance`, `stacks__read_only_call`, `stacks__resolve_name`) before any write.
- Never ask the user for a private key. Signing uses the extension mount config (`senderKey` / `STACKS_SENDER_KEY`).
- Write tools require human approval before execution.
