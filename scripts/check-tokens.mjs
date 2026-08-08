#!/usr/bin/env node
/* ==========================================================================
   check-tokens.mjs — verify the shared design tokens stay in sync.

   shared/tokens.css is the canonical definition of the --zj-* tokens.
   Each platform adapter embeds a verbatim copy of that block. This script:

     1. extracts every `--zj-*: <value>;` declaration from shared/tokens.css
     2. FAILS if an adapter is missing a token or defines it with a
        different value (the blocks must stay verbatim copies)
     3. reports which tokens an adapter does not consume (informational —
        not every token applies to every platform), and FAILS if a token
        is not consumed by ANY adapter (dead token → remove it from shared)
     4. does a naive brace-balance sanity check on every CSS file

   Usage:  node scripts/check-tokens.mjs
   Exit code 0 = all good, 1 = problems found.
   ========================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SHARED = 'shared/tokens.css';
const ADAPTERS = ['typora/zj.css', 'obsidian/theme.css'];

const TOKEN_RE = /(--zj-[\w-]+)\s*:\s*([^;]+);/g;

let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL ${msg}`); };

function read(file) {
    return readFileSync(join(root, file), 'utf8');
}

function extractTokens(css) {
    const tokens = new Map();
    for (const m of css.matchAll(TOKEN_RE)) tokens.set(m[1], m[2].trim());
    return tokens;
}

/* how often a token name occurs beyond its own definition (i.e. real uses) */
function useCount(css, name) {
    const occurrences = css.split(name).length - 1;
    const defined = new RegExp(`${name}\\s*:`).test(css) ? 1 : 0;
    return occurrences - defined;
}

/* --- 1 & 2: shared tokens vs adapter token blocks ----------------------- */

const sharedTokens = extractTokens(read(SHARED));
console.log(`shared/tokens.css: ${sharedTokens.size} tokens`);

const adapterCss = new Map();
for (const adapter of ADAPTERS) {
    const css = read(adapter);
    adapterCss.set(adapter, css);
    const tokens = extractTokens(css);

    for (const [name, value] of sharedTokens) {
        if (!tokens.has(name)) {
            fail(`${adapter}: missing token ${name}`);
        } else if (tokens.get(name) !== value) {
            fail(`${adapter}: ${name} = "${tokens.get(name)}", expected "${value}"`);
        }
    }
    for (const name of tokens.keys()) {
        if (!sharedTokens.has(name)) fail(`${adapter}: unknown token ${name} (not in shared)`);
    }
}

/* --- 3: consumption report ---------------------------------------------- */

for (const adapter of ADAPTERS) {
    const css = adapterCss.get(adapter);
    const unused = [...sharedTokens.keys()].filter((n) => useCount(css, n) === 0);
    console.log(`${adapter}: ${sharedTokens.size - unused.length}/${sharedTokens.size} tokens consumed` +
        (unused.length ? ` (unused: ${unused.join(', ')})` : ''));
}
for (const name of sharedTokens.keys()) {
    const usedSomewhere = ADAPTERS.some((a) => useCount(adapterCss.get(a), name) > 0);
    if (!usedSomewhere) fail(`${name} is not consumed by any adapter — dead token, remove it from shared`);
}

/* --- 4: naive brace-balance check --------------------------------------- */

for (const file of [SHARED, ...ADAPTERS]) {
    const stripped = read(file)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/"[^"]*"|'[^']*'/g, '');
    const open = (stripped.match(/\{/g) || []).length;
    const close = (stripped.match(/\}/g) || []).length;
    if (open !== close) fail(`${file}: unbalanced braces (${open} open, ${close} close)`);
}

/* ------------------------------------------------------------------------ */

if (failures) {
    console.log(`\n${failures} problem(s) found.`);
    process.exit(1);
}
console.log('\nAll checks passed.');
