import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync('src/lib/site-routes.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { isEditorialRoute } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

test('public pages share the editorial frame, including nested readers and tools', () => {
  for (const route of ['/', '/contact', '/speaking', '/newsletter', '/newsletter/3-15-26', '/brief/3-23-26', '/assessment', '/intake', '/learn', '/learn/supplier-readiness-builder', '/learn/find-leads', '/privacy']) {
    assert.equal(isEditorialRoute(route), true, route);
  }
});

test('admin, publishing tools, LaunchBox reader and lesson decks keep their own frame', () => {
  for (const route of ['/admin', '/admin-login', '/admin/newsletters', '/emails', '/create/blog', '/launchbox-weekly/2026-10-19', '/resources/classes/class-2', '/free-class/1']) {
    assert.equal(isEditorialRoute(route), false, route);
  }
  assert.equal(isEditorialRoute('/administration-guide'), true);
});
