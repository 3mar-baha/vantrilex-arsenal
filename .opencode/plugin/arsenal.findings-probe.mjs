/**
 * NODE P1 findings probe for .opencode/plugin/arsenal.ts (F1/F3/F4/F5/F7/F8).
 *
 * Run: node .opencode/plugin/arsenal.findings-probe.mjs
 * Exit 0 when every probe passes, 1 with the failing probe named otherwise.
 * All scratch state lives under the OS temp area; the repository is only read.
 *
 * Import-safety: the module has no side effects on import (main runs only
 * when executed directly), so a runtime that imports every file in the
 * plugin directory observes a inert module here, not a second plugin.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import pluginModule, {
  DEFAULT_DOCS_GUARD,
  bashMarkdownTargets,
  docsDisciplineGuard,
  findDispatcherAppendTarget,
  firstUsableRoot,
  isBareRoot,
  preCompact,
  sanitizeSessionId,
} from "./arsenal.ts";

const PROBE_ROOT = path.join(os.tmpdir(), "opencode", "node-p1", "probe-run");

let passed = 0;

const check = (name, fn) => {
  try {
    const out = fn();
    if (out instanceof Promise) {
      return out.then(
        () => {
          passed += 1;
          console.log("ok - " + name);
        },
        (error) => {
          console.error("FAIL - " + name + ": " + (error && error.message ? error.message : String(error)));
          process.exitCode = 1;
        },
      );
    }
    passed += 1;
    console.log("ok - " + name);
    return undefined;
  } catch (error) {
    console.error("FAIL - " + name + ": " + (error && error.message ? error.message : String(error)));
    process.exitCode = 1;
    return undefined;
  }
};

const makeDocsCtx = (overrides) => ({
  rt: {
    fs: null,
    path: null,
    execFile: null,
    os: null,
    proc: { env: {}, platform: "win32", execPath: "node", cwd: () => "C:/proj" },
    loadErrors: [],
  },
  root: "C:/proj",
  client: undefined,
  sessions: new Map(),
  anchors: new Map(),
  config: {
    docsGuard: { ...DEFAULT_DOCS_GUARD, mode: "block", enabled: true },
    taskDispatcher: { enabled: true },
  },
  tscChain: Promise.resolve(),
  pendingWarnings: [],
  lastLogTarget: null,
  ...(overrides ?? {}),
});

const throwsNaming = async (ctx, tool, args, mustName, mustNotName) => {
  let message = "";
  try {
    await docsDisciplineGuard(ctx, { tool, sessionID: "ses_probe", callID: "c1" }, { args });
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }
  assert.ok(message.length > 0, "expected a BLOCKED throw, got silence");
  for (const name of mustName) assert.ok(message.includes(name), "message names " + name + " :: " + message);
  for (const name of mustNotName ?? []) {
    assert.ok(!message.includes(name), "message must not name " + name + " :: " + message);
  }
  return message;
};

const silent = async (ctx, tool, args) => {
  await docsDisciplineGuard(ctx, { tool, sessionID: "ses_probe", callID: "c1" }, { args });
  return ctx.pendingWarnings.length;
};

const main = async () => {
  fs.rmSync(PROBE_ROOT, { recursive: true, force: true });
  const proj = path.join(PROBE_ROOT, "proj");
  const stateDir = path.join(PROBE_ROOT, "state");
  fs.mkdirSync(proj, { recursive: true });
  fs.mkdirSync(stateDir, { recursive: true });
  process.env.VANTRILEX_STATE_DIR = stateDir;

  // ---- F1: bash writes get the same verdict path as edit-tool writes ----
  await check("F1 redirect writes are blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "echo '# x' > docs/EVIL-NOTES.md" }, ["docs/EVIL-NOTES.md"], []),
  );
  await check("F1 append redirect is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "printf '# y' >> docs/APPEND-EVIL.md" }, ["docs/APPEND-EVIL.md"], []),
  );
  await check("F1 heredoc redirect is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "cat <<'EOF' > docs/HEREDOC-EVIL.md\n# hi\nEOF" }, ["docs/HEREDOC-EVIL.md"], []),
  );
  await check("F1 tee target is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "echo hi | tee docs/TEE-EVIL.md" }, ["docs/TEE-EVIL.md"], []),
  );
  await check("F1 quoted tee -a target is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: 'echo hi | tee -a "docs/QUOTED-EVIL.md"' }, ["docs/QUOTED-EVIL.md"], []),
  );
  await check("F1 harmless commands stay silent", async () => {
    assert.equal(await silent(makeDocsCtx(), "bash", { command: "echo hello" }), 0);
    assert.equal(await silent(makeDocsCtx(), "bash", { command: "echo x > logs/out.log" }), 0);
    assert.equal(await silent(makeDocsCtx(), "bash", { command: "echo x > brand/ok.md" }), 0);
  });
  await check("F1 extractor unit cases", () => {
    assert.deepEqual(bashMarkdownTargets("C:/proj", "echo a > docs/A.md && echo b >> docs/B.md"), ["docs/A.md", "docs/B.md"]);
    assert.deepEqual(bashMarkdownTargets("C:/proj", 42), []);
    assert.deepEqual(bashMarkdownTargets("C:/proj", ""), []);
  });

  await check("F1 R2 prose tee mention yields no operands and stays silent", async () => {
    assert.deepEqual(bashMarkdownTargets("C:/proj", "echo use tee to write docs/FOO.md"), []);
    assert.equal(await silent(makeDocsCtx(), "bash", { command: "echo use tee to write docs/FOO.md" }), 0);
  });
  await check("F1 R2 grep-equals tee yields no operands and stays silent", async () => {
    assert.deepEqual(bashMarkdownTargets("C:/proj", "git log --grep=tee -- docs/EVIL.md"), []);
    assert.equal(await silent(makeDocsCtx(), "bash", { command: "git log --grep=tee -- docs/EVIL.md" }), 0);
  });
  await check("F1 R2 bare word tee after echo stays silent", async () => {
    assert.deepEqual(bashMarkdownTargets("C:/proj", "echo tee docs/EVIL.md"), []);
    assert.equal(await silent(makeDocsCtx(), "bash", { command: "echo tee docs/EVIL.md" }), 0);
  });
  await check("F1 R2 tee inside commit message stays silent", async () => {
    assert.deepEqual(bashMarkdownTargets("C:/proj", "git commit -m tee docs/EVIL.md"), []);
    assert.equal(await silent(makeDocsCtx(), "bash", { command: "git commit -m tee docs/EVIL.md" }), 0);
  });
  await check("F1 R2 piped tee still verdicts (positive control)", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "echo hi | tee docs/X.md" }, ["docs/X.md"], []),
  );
  // ---- F3: multi-file reports name the right files ----
  await check("F3 allowed-then-denied names the denied file", () =>
    throwsNaming(
      makeDocsCtx(),
      "edit",
      { files: ["brand/OK.md", "docs/EVIL-B.md"] },
      ["docs/EVIL-B.md"],
      ["brand/OK.md"],
    ),
  );
  await check("F3 denied-then-allowed names the denied file", () =>
    throwsNaming(
      makeDocsCtx(),
      "edit",
      { files: ["docs/EVIL-B.md", "brand/OK.md"] },
      ["docs/EVIL-B.md"],
      ["brand/OK.md"],
    ),
  );
  await check("F3 two denied files are both named in order", async () => {
    const message = await throwsNaming(
      makeDocsCtx(),
      "edit",
      { files: ["docs/EVIL-A.md", "docs/EVIL-B.md"] },
      ["docs/EVIL-A.md", "docs/EVIL-B.md"],
      [],
    );
    assert.ok(message.indexOf("docs/EVIL-A.md") < message.indexOf("docs/EVIL-B.md"), "order kept :: " + message);
  });

  // ---- F4: hostile session ids cannot escape the state directory ----
  await check("F4 sanitizer mapping", () => {
    assert.equal(sanitizeSessionId("ses_abc-123.X_y"), "ses_abc-123.X_y");
    assert.equal(sanitizeSessionId("anonymous"), "anonymous");
    assert.equal(sanitizeSessionId("../../x"), "_.._x");
    assert.equal(sanitizeSessionId(".."), "anonymous");
    assert.equal(sanitizeSessionId("."), "anonymous");
    assert.equal(sanitizeSessionId(""), "anonymous");
    assert.equal(sanitizeSessionId(null), "anonymous");
    for (const hostile of ["../../x", "..\\..\\x", "/abs", "a/b", "a:b", ""]) {
      assert.ok(!/[\\/]/.test(sanitizeSessionId(hostile)), "no separator survives in " + JSON.stringify(hostile));
    }
  });
  await check("F4 hostile id stays inside the state dir (preCompact)", async () => {
    const rt = {
      fs,
      path,
      execFile: null,
      os,
      proc: process,
      loadErrors: [],
    };
    const ctx = {
      rt,
      root: proj,
      client: undefined,
      sessions: new Map(),
      anchors: new Map(),
      config: {
        docsGuard: { ...DEFAULT_DOCS_GUARD, mode: "block", enabled: true },
        taskDispatcher: { enabled: true },
      },
      tscChain: Promise.resolve(),
      pendingWarnings: [],
      lastLogTarget: null,
    };
    const rawEscape = path.resolve(stateDir, "handoff", "../../evil.md");
    assert.ok(!rawEscape.startsWith(stateDir), "control: an unsanitised join escapes (" + rawEscape + ")");
    const output = { context: [] };
    await preCompact(ctx, { sessionID: "../../evil" }, output);
    assert.equal(output.context.length, 1);
    const safeName = sanitizeSessionId("../../evil") + ".md";
    assert.ok(fs.existsSync(path.join(stateDir, "handoff", safeName)), "sanitised handoff exists");
    assert.deepEqual(fs.readdirSync(path.join(stateDir, "handoff")), [safeName]);
    assert.ok(!fs.existsSync(path.join(PROBE_ROOT, "evil.md")), "nothing escaped the state dir");
    const landed = path.resolve(stateDir, "handoff", safeName);
    assert.ok(landed.startsWith(stateDir), "landed path is contained (" + landed + ")");
  });

  // ---- F5: UNC roots, trimming ----
  await check("F5 bare-root table", () => {
    const bare = ["/", "\\", "//", "\\\\", "C:\\", "C:/", "\\\\server\\share", "//server/share", "\\\\server\\share\\", "  /  "];
    for (const entry of bare) assert.equal(isBareRoot(entry), true, JSON.stringify(entry) + " is bare");
    const usable = ["C:/proj", "C:\\proj", "\\\\server\\share\\proj", "//server/share/proj", "relative/dir", "docs"];
    for (const entry of usable) assert.equal(isBareRoot(entry), false, JSON.stringify(entry) + " is usable");
  });
  await check("F5 firstUsableRoot selection and trimming", () => {
    assert.equal(firstUsableRoot("/", "C:/proj"), "C:/proj");
    assert.equal(firstUsableRoot("\\\\server\\share", "D:/work"), "D:/work");
    assert.equal(firstUsableRoot("//server/share", "//", "E:/w"), "E:/w");
    assert.equal(firstUsableRoot("  C:\\proj  "), "C:\\proj");
    assert.equal(firstUsableRoot("/", "C:\\", "//"), "/");
    assert.equal(firstUsableRoot("", "  ", null, 42), null);
  });

  // ---- F7: kill-switch parity, no state mutation when disabled ----
  await check("F7 V1 disabled records no intent and injects nothing", async () => {
    const projDisabled = path.join(PROBE_ROOT, "proj-disabled");
    fs.mkdirSync(path.join(projDisabled, ".opencode"), { recursive: true });
    fs.writeFileSync(path.join(projDisabled, ".opencode", "arsenal.json"), JSON.stringify({ taskDispatcher: { enabled: false } }), "utf8");
    const hooks = await pluginModule.server({ directory: projDisabled });
    const parts = [{ type: "text", text: "hello world" }];
    await hooks["chat.message"]({ sessionID: "ses_f7" }, { message: {}, parts });
    assert.equal(parts[0].text, "hello world");
    await hooks.event({ event: { type: "session.deleted", properties: { sessionID: "ses_f7" } } });
    const learnings = fs.readFileSync(path.join(stateDir, "latest-session.md"), "utf8");
    assert.ok(learnings.includes("Not captured."), "no intent captured while disabled :: " + learnings);
    assert.ok(!learnings.includes("hello world"), "user text leaked nowhere :: " + learnings);
  });
  await check("F7 V1 enabled still injects (positive control)", async () => {
    const hooks = await pluginModule.server({ directory: proj });
    const parts = [{ type: "text", text: "do the thing" }];
    await hooks["chat.message"]({ sessionID: "ses_f7on" }, { message: {}, parts });
    assert.ok(parts[0].text.includes("task-dispatcher"), "instruction appended when armed");
  });
  await check("F7 V2 disabled leaves the draft untouched", async () => {
    const projDisabled = path.join(PROBE_ROOT, "proj-disabled");
    let captured = null;
    const fake = {
      location: { directory: projDisabled },
      session: {
        hook: async (name, cb) => {
          captured = cb;
          return undefined;
        },
      },
    };
    await pluginModule.setup(fake);
    assert.ok(typeof captured === "function", "prompt hook registered");
    const event = { sessionID: "ses_f7v2", prompt: { text: "hello v2" } };
    await captured(event);
    assert.equal(event.prompt.text, "hello v2");
  });
  await check("F7 V2 enabled still appends (positive control)", async () => {
    let captured = null;
    const fake = {
      location: { directory: proj },
      session: {
        hook: async (name, cb) => {
          captured = cb;
          return undefined;
        },
      },
    };
    await pluginModule.setup(fake);
    const event = { sessionID: "ses_f7v2on", prompt: { text: "hello v2" } };
    await captured(event);
    assert.ok(event.prompt.text.includes("task-dispatcher"), "V2 instruction appended when armed");
  });

  // ---- F8: role-aware part targeting ----
  await check("F8 target unit cases", () => {
    const plain = [
      { type: "text", text: "a" },
      { type: "text", text: "b" },
    ];
    assert.equal(findDispatcherAppendTarget(plain), plain[1]);
    const mixed = [
      { role: "assistant", type: "text", text: "A" },
      { role: "user", type: "text", text: "U" },
    ];
    assert.equal(findDispatcherAppendTarget(mixed), mixed[1]);
    assert.equal(findDispatcherAppendTarget([{ role: "assistant", type: "text", text: "A" }]), null);
    assert.equal(findDispatcherAppendTarget([]), null);
    assert.equal(findDispatcherAppendTarget([{ type: "image", text: "x" }]), null);
  });
  await check("F8 e2e prefers the user part, leaves assistant parts alone", async () => {
    const hooks = await pluginModule.server({ directory: proj });
    const parts = [
      { role: "assistant", type: "text", text: "A" },
      { role: "user", type: "text", text: "U" },
    ];
    await hooks["chat.message"]({ sessionID: "ses_f8" }, { message: {}, parts });
    assert.equal(parts[0].text, "A");
    assert.ok(parts[1].text.startsWith("U") && parts[1].text.includes("task-dispatcher"));
    const solo = [{ role: "assistant", type: "text", text: "A" }];
    await hooks["chat.message"]({ sessionID: "ses_f8b" }, { message: {}, parts: solo });
    assert.equal(solo[0].text, "A");
  });

  // ---- Deliberately unchanged: F2 warn-default fail-open, F6 CLAUDE.md ----
  await check("F2 warn mode still warns instead of throwing", async () => {
    const ctx = makeDocsCtx({ config: { docsGuard: { ...DEFAULT_DOCS_GUARD, mode: "warn", enabled: true }, taskDispatcher: { enabled: true } } });
    const warnings = await silent(ctx, "edit", { filePath: "docs/EVIL-WARN.md" });
    assert.equal(warnings, 1);
  });
  await check("F2/F6 kill switches still honoured (off / disabled)", async () => {
    const off = makeDocsCtx({ config: { docsGuard: { ...DEFAULT_DOCS_GUARD, mode: "off", enabled: true }, taskDispatcher: { enabled: true } } });
    assert.equal(await silent(off, "bash", { command: "echo '# x' > docs/EVIL-OFF.md" }), 0);
    const disabled = makeDocsCtx({ config: { docsGuard: { ...DEFAULT_DOCS_GUARD, mode: "block", enabled: false }, taskDispatcher: { enabled: true } } });
    assert.equal(await silent(disabled, "bash", { command: "echo '# x' > docs/EVIL-DISABLED.md" }), 0);
  });
  await check("F6 CLAUDE.md stays allow-listed", async () => {
    assert.equal(await silent(makeDocsCtx(), "edit", { filePath: "CLAUDE.md" }), 0);
  });

  console.log("probe: " + passed + " checks passed");
};

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invoked) {
  await main();
}
