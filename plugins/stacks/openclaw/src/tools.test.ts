import { describe, expect, it } from 'vitest';
import { stacksToolSpecs } from './tools.js';

describe('stacksToolSpecs registry', () => {
  it('registers 33 core agent-core tools', () => {
    expect(stacksToolSpecs).toHaveLength(33);
  });

  it('includes sBTC and Zest tool names', () => {
    const names = new Set(stacksToolSpecs.map((tool) => tool.name));
    expect(names.has('stacks_sbtc_get_balance')).toBe(true);
    expect(names.has('stacks_zest_supply_sbtc')).toBe(true);
  });
});
