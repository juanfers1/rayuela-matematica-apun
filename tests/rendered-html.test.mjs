import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the mathematical hopscotch experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Rayuela para entender el mundo/i);
  assert.match(html, /Matemáticas[\s\S]*Literatura/i);
  assert.match(html, /Juan Carlos Maya López/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("creates a repository-path-safe GitHub Pages build", async () => {
  await access(new URL("../gh-pages/index.html", import.meta.url));
  const html = await readFile(new URL("../gh-pages/index.html", import.meta.url), "utf8");
  assert.match(html, /\.\/assets\//i);
  assert.doesNotMatch(html, /src="\/assets\//i);
});
