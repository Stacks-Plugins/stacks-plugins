import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSbtcAmount, formatSbtcAmount, SBTC_BASE } from '../dist/utils/amounts.js';

test('parseSbtcAmount accepts integer base units', () => {
  assert.equal(parseSbtcAmount('100000000'), 100_000_000n);
});

test('parseSbtcAmount converts human sBTC', () => {
  assert.equal(parseSbtcAmount('0.001'), 100_000n);
  assert.equal(parseSbtcAmount('1 sbtc'), SBTC_BASE);
});

test('parseSbtcAmount accepts satoshi suffix', () => {
  assert.equal(parseSbtcAmount('5000 sats'), 5000n);
});

test('formatSbtcAmount renders human-readable values', () => {
  assert.equal(formatSbtcAmount(100_000_000n), '1 sBTC');
  assert.equal(formatSbtcAmount(100_000n), '0.001 sBTC');
});

test('parseSbtcAmount rejects empty input', () => {
  assert.throws(() => parseSbtcAmount(''), /Empty sBTC amount/);
});
