/**
 * NODE P1 findings probe for .opencode/plugin/arsenal.ts
 * (F1/F3/F4/F5/F7/F8 + M-1 tee prefixes + V2 surface + argv/egress)
 * plus the POST87 §2 U-slice battery: ق-6 plan-guard merge, م-3 six-hook
 * capability probe, م-4 kill switch (four signals), Diff Size Guard,
 * and the RUN-0.9.0-FIX seat-deny overlay (HOOK 9).
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
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import pluginModule, {
  DEFAULT_DOCS_GUARD,
  PLAN_DRIFT_TAG,
  bashMarkdownTargets,
  diffSizeGuard,
  docsDisciplineGuard,
  findDispatcherAppendTarget,
  firstUsableRoot,
  formatCapabilityLines,
  isBareRoot,
  parseSeatPermissions,
  preCompact,
  probeHookCapabilities,
  resolveSeatPermission,
  sanitizeSessionId,
  seatDenyOverlay,
  taskDispatcher,
  v2ToolBefore,
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

const captureV2 = async (dir) => {
  const seen = {};
  const fake = {
    location: { directory: dir },
    session: {
      hook: async (name, cb) => {
        seen["session:" + name] = cb;
      },
      // V2 `ctx.session.get`: the seat-deny overlay's documented fallback for
      // an evaluation whose `agent` field is absent.
      get: async ({ sessionID }) => ({ id: sessionID, agent: "aether" }),
    },
    tool: {
      hook: async (name, cb) => {
        seen["tool:" + name] = cb;
      },
    },
    shell: {
      hook: async (name, cb) => {
        seen["shell:" + name] = cb;
      },
    },
    permission: {
      hook: async (name, cb) => {
        seen["permission:" + name] = cb;
      },
    },
  };
  await pluginModule.setup(fake);
  return seen;
};

/**
 * Capture the prompt registration(s) a setup call performs, so a test can
 * prove the merge: exactly one `prompt` hook, not one dispatcher hook plus a
 * carrier hook.
 */
const capturePrompt = async (dir) => {
  const registered = [];
  let callback = null;
  const fake = {
    location: { directory: dir },
    session: {
      hook: async (name, cb) => {
        registered.push(name);
        if (name === "prompt") callback = cb;
      },
    },
  };
  await pluginModule.setup(fake);
  return { registered, call: callback };
};

/** Run one warn-mode docs write through the V1 hooks and return the result text. */
const docsWarningThrough = async (dir) => {
  const hooks = await pluginModule.server({ directory: dir });
  const args = { filePath: "docs/KILL-SWITCH.md" };
  const output = { title: "", output: "prior", metadata: {} };
  await hooks["tool.execute.before"]({ tool: "write", sessionID: "ses_kill", callID: "c1" }, { args });
  await hooks["tool.execute.after"](
    { tool: "write", sessionID: "ses_kill", callID: "c1", args },
    output,
  );
  return output.output;
};

/** Scratch project carrying only the config a case needs. */
const killProject = (name, config) => {
  const dir = path.join(PROBE_ROOT, name);
  fs.mkdirSync(path.join(dir, ".opencode"), { recursive: true });
  if (config) fs.writeFileSync(path.join(dir, ".opencode", "config.json"), JSON.stringify(config), "utf8");
  return dir;
};

/** The plugin context shape the exported guards take. */
const makeGuardCtx = (root, overrides) => ({
  rt: { fs, path, execFile, os, proc: process, loadErrors: [] },
  root,
  client: undefined,
  sessions: new Map(),
  anchors: new Map(),
  config: {
    docsGuard: { ...DEFAULT_DOCS_GUARD, mode: "off", enabled: false },
    taskDispatcher: { enabled: true },
    vantrilex: { enabled: true, excludedProjects: [] },
  },
  tscChain: Promise.resolve(),
  pendingWarnings: [],
  lastLogTarget: null,
  capabilityLines: [],
  capabilitiesFlushed: false,
  ...(overrides ?? {}),
});

const throwsV2Tool = async (seen, event, mustName) => {
  let message = "";
  try {
    await seen["tool:execute.before"](event);
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }
  assert.ok(message.length > 0, "expected a V2 BLOCKED throw, got silence");
  for (const name of mustName) assert.ok(message.includes(name), "V2 message names " + name + " :: " + message);
  return message;
};

const main = async () => {
  fs.rmSync(PROBE_ROOT, { recursive: true, force: true });
  const proj = path.join(PROBE_ROOT, "proj");
  const stateDir = path.join(PROBE_ROOT, "state");
  fs.mkdirSync(proj, { recursive: true });
  fs.mkdirSync(stateDir, { recursive: true });
  process.env.VANTRILEX_STATE_DIR = stateDir;
  const projBlock = path.join(PROBE_ROOT, "proj-block");
  fs.mkdirSync(path.join(projBlock, ".opencode"), { recursive: true });
  fs.writeFileSync(
    path.join(projBlock, ".opencode", "arsenal.json"),
    JSON.stringify({ docsGuard: { mode: "block", enabled: true } }),
    "utf8",
  );

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
  // ---- M-1: privilege/path-prefixed tee is command position ----
  await check("M-1 piped sudo tee is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "echo hi | sudo tee docs/X.md" }, ["docs/X.md"], []),
  );
  await check("M-1 bare sudo tee is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "sudo tee docs/X.md" }, ["docs/X.md"], []),
  );
  await check("M-1 path-qualified tee is blocked and named", async () => {
    await throwsNaming(makeDocsCtx(), "bash", { command: "echo hi | /usr/bin/tee docs/PATH-TEE.md" }, ["docs/PATH-TEE.md"], []);
    await throwsNaming(makeDocsCtx(), "bash", { command: "/usr/bin/tee docs/PATH-BARE.md" }, ["docs/PATH-BARE.md"], []);
  });
  await check("M-1 pipe-merge tee is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "echo hi |& tee docs/MERGE-TEE.md" }, ["docs/MERGE-TEE.md"], []),
  );
  await check("M-1 newline tee is blocked and named", () =>
    throwsNaming(makeDocsCtx(), "bash", { command: "echo hi\ntee docs/NEWLINE-TEE.md" }, ["docs/NEWLINE-TEE.md"], []),
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

  // ---- V2 surface: every guard reachable via Plugin.define + setup ----
  await check("V2 setup registers prompt + tool.before/after + shell.before", async () => {
    const seen = await captureV2(proj);
    for (const want of [
      "session:prompt",
      "tool:execute.before",
      "tool:execute.after",
      "shell:create.before",
      "permission:evaluate",
    ]) {
      assert.ok(typeof seen[want] === "function", "registered " + want);
    }
  });  await check("V2 tool.before blocks write-tool docs path", async () => {
    const seen = await captureV2(projBlock);
    await throwsV2Tool(seen, { tool: "write", sessionID: "ses_v2", id: "c1", input: { filePath: "docs/EVIL-V2.md" } }, ["docs/EVIL-V2.md"]);
  });
  await check("V2 tool.before blocks sudo-tee bash (M-1 via V2)", async () => {
    const seen = await captureV2(projBlock);
    await throwsV2Tool(seen, { tool: "bash", sessionID: "ses_v2", id: "c1", input: { command: "echo hi | sudo tee docs/X.md" } }, ["docs/X.md"]);
  });
  await check("V2 tool.before blocks unlogged dev server", async () => {
    const seen = await captureV2(projBlock);
    let message = "";
    try {
      await seen["tool:execute.before"]({ tool: "bash", sessionID: "ses_v2", id: "c1", input: { command: "npm run dev" } });
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    assert.ok(message.includes("long-running-process-guard"), "V2 long-running blocks :: " + message);
  });
  await check("V2 shell.before blocks piped tee", async () => {
    const seen = await captureV2(projBlock);
    let message = "";
    try {
      await seen["shell:create.before"]({ command: "echo hi | tee docs/SHELL-TEE.md", cwd: projBlock, timeout: 30000, shell: "bash", env: {} });
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    assert.ok(message.includes("docs/SHELL-TEE.md"), "V2 shell.before names the file :: " + message);
  });
  await check("V2 warn-default flushes to string result.content", async () => {
    const seen = await captureV2(proj);
    await seen["tool:execute.before"]({ tool: "bash", sessionID: "ses_v2w", id: "c1", input: { command: "echo x > docs/WARN-V2.md" } });
    const result = { content: "prior output" };
    await seen["tool:execute.after"]({ tool: "bash", sessionID: "ses_v2w", id: "c1", input: { command: "echo x > docs/WARN-V2.md" }, status: "completed", result });
    assert.ok(String(result.content).includes("docs/WARN-V2.md"), "warn verdict forwarded :: " + String(result.content));
  });
  await check("V2 after pushes a text part onto array result.content", async () => {
    const seen = await captureV2(proj);
    await seen["tool:execute.before"]({ tool: "write", sessionID: "ses_v2a", id: "c1", input: { filePath: "docs/ARR-V2.md" } });
    const result = { content: [{ type: "text", text: "prior" }] };
    await seen["tool:execute.after"]({ tool: "write", sessionID: "ses_v2a", id: "c1", input: { filePath: "docs/ARR-V2.md" }, status: "completed", result });
    assert.equal(result.content.length, 2);
    assert.ok(String(result.content[1].text).includes("docs/ARR-V2.md"), "verdict pushed :: " + JSON.stringify(result.content));
  });
  await check("argv safety: shell-free spawn only", () => {
    const src = fs.readFileSync(new URL("./arsenal.ts", import.meta.url), "utf8");
    assert.ok(src.includes("execFile("), "execFile is the spawn path");
    assert.ok(!src.includes("shell: true"), "no shell:true spawn");
    assert.ok(!src.includes("spawn("), "no spawn()");
    assert.ok(!src.includes("execSync"), "no execSync");
  });
  await check("egress: no network surface in the plugin", () => {
    const src = fs.readFileSync(new URL("./arsenal.ts", import.meta.url), "utf8");
    assert.ok(!src.includes("fetch("), "no fetch");
    assert.ok(!src.includes("node:http"), "no node:http");
    assert.ok(!src.includes("XMLHttpRequest"), "no XHR");
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

  // ---- R3 follow-up: V2 bare-root bypass (MEDIUM) ----
  // setup() resolves its root through firstUsableRoot, matching V1 (F5). The
  // cwd is patched to a controlled fallback so the resolution is observable:
  // a bare-root location must fall through to the fallback's block config,
  // while a normal location keeps precedence over the fallback's off config.
  await check("R3 V2 bare-root location resolves past it (F5 via setup)", async () => {
    const fallback = path.join(PROBE_ROOT, "proj-fallback");
    fs.mkdirSync(path.join(fallback, ".opencode"), { recursive: true });
    fs.writeFileSync(
      path.join(fallback, ".opencode", "arsenal.json"),
      JSON.stringify({ docsGuard: { mode: "block", enabled: true } }),
      "utf8",
    );
    const realCwd = process.cwd;
    process.cwd = () => fallback;
    try {
      const seen = await captureV2("/");
      await throwsV2Tool(
        seen,
        { tool: "write", sessionID: "ses_r3_bare", id: "c1", input: { filePath: "docs/EVIL-R3-BARE.md" } },
        ["docs/EVIL-R3-BARE.md"],
      );
    } finally {
      process.cwd = realCwd;
    }
  });
  await check("R3 V2 normal location keeps precedence over the cwd fallback", async () => {
    const fallbackOff = path.join(PROBE_ROOT, "proj-fallback-off");
    fs.mkdirSync(path.join(fallbackOff, ".opencode"), { recursive: true });
    fs.writeFileSync(
      path.join(fallbackOff, ".opencode", "arsenal.json"),
      JSON.stringify({ docsGuard: { mode: "off", enabled: true } }),
      "utf8",
    );
    const realCwd = process.cwd;
    process.cwd = () => fallbackOff;
    try {
      const seen = await captureV2(projBlock);
      await throwsV2Tool(
        seen,
        { tool: "write", sessionID: "ses_r3_prec", id: "c1", input: { filePath: "docs/EVIL-R3-PREC.md" } },
        ["docs/EVIL-R3-PREC.md"],
      );
    } finally {
      process.cwd = realCwd;
    }
  });

  // ---- R3 follow-up: V2 tool.before working-set gap (LOW) ----
  // v2ToolBefore records candidate paths under the event session id before the
  // guards run, mirroring V1. brand/OK.md is allow-listed, so neither guard
  // touches session state for it: the only sessions entry must come from the
  // working-set recording itself.
  await check("R3 V2 tool.before records the working set under the event session", async () => {
    const ctx = makeDocsCtx();
    await v2ToolBefore(ctx, { tool: "edit", sessionID: "ses_r3_ws", id: "c1", input: { filePath: "brand/OK.md" } });
    const state = ctx.sessions.get("ses_r3_ws");
    assert.ok(state, "session state exists for the event session id");
    assert.ok(
      state.touchedFiles.has("brand/OK.md"),
      "working set holds brand/OK.md :: " + JSON.stringify(Array.from(state.touchedFiles)),
    );
    assert.equal(ctx.sessions.has("anonymous"), false, "nothing attributed to anonymous");
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

  // ---- ق-6: plan-guard append merged into the single prompt registration ----
  const planPrompt = [
    "Plan-Doc-Begin: MISSION-PLAN.md",
    "Lane VTA-PLAN-01 opens with node p1-kept.",
    "Plan-Doc-End",
    "Brief: lane VTA-PLAN-01 node p9-nowhere.",
  ].join("\n");

  await check("Q6 setup registers exactly one prompt hook (carrier merge)", async () => {
    const { registered } = await capturePrompt(proj);
    assert.deepEqual(registered, ["prompt"], "one prompt registration :: " + JSON.stringify(registered));
  });
  await check("Q6 plan-guard text is appended by that one prompt hook", async () => {
    const { call } = await capturePrompt(proj);
    const event = { sessionID: "ses_q6", prompt: { text: planPrompt } };
    await call(event);
    const text = event.prompt.text;
    assert.ok(text.includes(PLAN_DRIFT_TAG), "drift tag present :: " + text);
    assert.ok(text.includes("p9-nowhere"), "drifting token named :: " + text);
    assert.ok(text.includes("task-dispatcher"), "dispatcher still appended by the same hook");
    assert.ok(
      text.includes("Plan-guard fallback (detective-only, non-blocking)"),
      "honesty note travels with the report",
    );
  });
  await check("Q6 plan-guard append stays idempotent within a turn", async () => {
    const { call } = await capturePrompt(proj);
    const first = { sessionID: "ses_q6b", prompt: { text: planPrompt } };
    await call(first);
    const once = first.prompt.text;
    const second = { sessionID: "ses_q6b", prompt: { text: once } };
    await call(second);
    assert.equal(second.prompt.text, once, "second pass rewrote the draft");
    assert.equal((once.match(/\[plan-guard\] plan-drift report/g) || []).length, 1, "one report");
  });
  await check("Q6 plan-guard stays silent without plan markers", async () => {
    const { call } = await capturePrompt(proj);
    const event = { sessionID: "ses_q6c", prompt: { text: "plain brief without markers" } };
    await call(event);
    assert.ok(!event.prompt.text.includes(PLAN_DRIFT_TAG), "no report without markers");
    assert.ok(event.prompt.text.includes("task-dispatcher"), "dispatcher unaffected");
  });
  await check("Q6 plan-guard appends even when the dispatcher is disabled", async () => {
    const dir = path.join(PROBE_ROOT, "proj-q6-off");
    fs.mkdirSync(path.join(dir, ".opencode"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, ".opencode", "arsenal.json"),
      JSON.stringify({ taskDispatcher: { enabled: false } }),
      "utf8",
    );
    const { call } = await capturePrompt(dir);
    const event = { sessionID: "ses_q6d", prompt: { text: planPrompt } };
    await call(event);
    assert.ok(!event.prompt.text.includes("task-dispatcher"), "dispatcher disarmed");
    assert.ok(event.prompt.text.includes(PLAN_DRIFT_TAG), "plan guard is independent of the dispatcher flag");
  });

  // ---- م-3: six-hook capability probe ----
  await check("M3 capability probe reports six hooks, absent by default", () => {
    const report = probeHookCapabilities({});
    assert.equal(report.length, 6, "six documented hooks");
    assert.deepEqual(
      report.map((entry) => entry.hook),
      ["sessionStart", "preCompact", "sessionEnd", "model.request", "ctx.permission", "ctx.storage"],
    );
    assert.ok(report.every((entry) => entry.available === false), "nothing claimed without observation");
    const lines = formatCapabilityLines(report);
    assert.equal(lines.length, 7, "one line per hook plus the gate");
    assert.ok(lines[6].includes("gate = 0/6"), "gate line :: " + lines[6]);
    assert.deepEqual(lines, formatCapabilityLines(probeHookCapabilities({})), "deterministic output");
  });
  await check("M3 capability probe observes only the registrars the host exposes", () => {
    const host = {
      session: { hook() {} },
      model: { hook() {} },
      permission: { hook() {} },
      storage: { get() {}, set() {} },
    };
    const report = probeHookCapabilities(host);
    const byHook = Object.fromEntries(report.map((entry) => [entry.hook, entry.available]));
    assert.equal(byHook["model.request"], true);
    assert.equal(byHook["ctx.permission"], true);
    assert.equal(byHook["ctx.storage"], true);
    assert.equal(byHook.sessionStart, false, "lifecycle hooks are never inferred from a session registrar");
    assert.equal(byHook.preCompact, false);
    assert.equal(byHook.sessionEnd, false);
    assert.ok(formatCapabilityLines(report)[6].includes("gate = 3/6"));
  });
  await check("M3 capability lines flush once on the first V2 tool result", async () => {
    const seen = await captureV2(proj);
    const first = { content: "first" };
    await seen["tool:execute.after"]({ tool: "read", sessionID: "ses_cap", id: "c1", input: {}, status: "completed", result: first });
    assert.equal((String(first.content).match(/capability-probe: gate =/g) || []).length, 1, "gate line emitted once");
    const second = { content: "second" };
    await seen["tool:execute.after"]({ tool: "read", sessionID: "ses_cap", id: "c2", input: {}, status: "completed", result: second });
    assert.equal(second.content, "second", "no second emission");
  });

  // ---- م-4: per-project kill switch, one test per signal ----
  await check("M4 arm control: no signal, the docs guard still warns", async () => {
    const dir = killProject("proj-kill-on");
    const text = await docsWarningThrough(dir);
    assert.ok(text.includes("docs-discipline-guard"), "positive control :: " + text);
  });
  await check("M4 signal 1: vantrilex.enabled=false in .opencode/config.json", async () => {
    const dir = killProject("proj-kill-config", { vantrilex: { enabled: false } });
    const text = await docsWarningThrough(dir);
    assert.equal(text, "prior", "no verdict appended :: " + text);
  });
  await check("M4 signal 2: .opencode/.vantrilex-disable exists", async () => {
    const dir = killProject("proj-kill-file");
    fs.writeFileSync(path.join(dir, ".opencode", ".vantrilex-disable"), "", "utf8");
    const text = await docsWarningThrough(dir);
    assert.equal(text, "prior", "no verdict appended :: " + text);
  });
  await check("M4 signal 3: VANTRILEX_DISABLED=1 in the environment", async () => {
    const dir = killProject("proj-kill-env");
    const previous = process.env.VANTRILEX_DISABLED;
    process.env.VANTRILEX_DISABLED = "1";
    try {
      const text = await docsWarningThrough(dir);
      assert.equal(text, "prior", "no verdict appended :: " + text);
    } finally {
      if (previous === undefined) delete process.env.VANTRILEX_DISABLED;
      else process.env.VANTRILEX_DISABLED = previous;
    }
  });
  await check("M4 signal 4: excludedProjects in the global config", async () => {
    const dir = killProject("proj-kill-excluded");
    const configHome = path.join(PROBE_ROOT, "xdg-kill");
    fs.mkdirSync(path.join(configHome, "opencode"), { recursive: true });
    fs.writeFileSync(
      path.join(configHome, "opencode", "opencode.json"),
      JSON.stringify({ vantrilex: { excludedProjects: [path.resolve(dir).replace(/\\/g, "/")] } }),
      "utf8",
    );
    const previous = process.env.XDG_CONFIG_HOME;
    process.env.XDG_CONFIG_HOME = configHome;
    try {
      const text = await docsWarningThrough(dir);
      assert.equal(text, "prior", "no verdict appended :: " + text);
    } finally {
      if (previous === undefined) delete process.env.XDG_CONFIG_HOME;
      else process.env.XDG_CONFIG_HOME = previous;
    }
  });

  // ---- Diff Size Guard: 120 lines / 4 files, one warning per HEAD ----
  const git = (cwd, args) =>
    execFileSync(
      "git",
      ["-c", "user.email=probe@example.invalid", "-c", "user.name=arsenal-probe", ...args],
      { cwd, encoding: "utf8" },
    );
  const seedRepo = (name) => {
    const repo = path.join(PROBE_ROOT, name);
    fs.rmSync(repo, { recursive: true, force: true });
    fs.mkdirSync(repo, { recursive: true });
    git(repo, ["init", "-q"]);
    return repo;
  };
  const names = ["a.txt", "b.txt", "c.txt", "d.txt", "e.txt"];
  const appendLines = (repo, perFile) => {
    names.forEach((entry, index) => {
      const count = Array.isArray(perFile) ? perFile[index] : perFile;
      fs.appendFileSync(path.join(repo, entry), Array.from({ length: count }, (_, line) => `line ${line}\n`).join(""), "utf8");
    });
  };
  const commitAll = (repo, message) => {
    git(repo, ["add", "."]);
    git(repo, ["commit", "-q", "-m", message]);
  };

  await check("D diff-size-guard fires at 121 lines over 5 files, once per HEAD", async () => {
    const repo = seedRepo("diff-repo");
    names.forEach((entry) => fs.writeFileSync(path.join(repo, entry), "base\n", "utf8"));
    commitAll(repo, "base");
    appendLines(repo, [25, 25, 25, 23, 23]);
    const ctx = makeGuardCtx(repo);
    await diffSizeGuard(ctx, "ses_diff", "write");
    assert.equal(ctx.pendingWarnings.length, 1, "one warning :: " + JSON.stringify(ctx.pendingWarnings));
    const line = ctx.pendingWarnings[0];
    assert.ok(line.includes("diff-size-guard: BLOCKED"), "guard named :: " + line);
    assert.ok(line.includes("121 uncommitted line(s)"), "line count measured :: " + line);
    assert.ok(line.includes("5 file(s)"), "file count measured :: " + line);
    assert.ok(line.includes("atomic commit"), "remedy named :: " + line);
    await diffSizeGuard(ctx, "ses_diff", "write");
    assert.equal(ctx.pendingWarnings.length, 1, "same HEAD does not re-warn");
    commitAll(repo, "atomic");
    appendLines(repo, 2);
    await diffSizeGuard(ctx, "ses_diff", "write");
    assert.equal(ctx.pendingWarnings.length, 2, "a commit re-arms the guard (5 files again)");
  });
  await check("D diff-size-guard stays silent at exactly 120 lines / 4 files", async () => {
    const repo = seedRepo("diff-repo-edge");
    const four = names.slice(0, 4);
    four.forEach((entry) => fs.writeFileSync(path.join(repo, entry), "base\n", "utf8"));
    commitAll(repo, "base");
    four.forEach((entry) => fs.appendFileSync(path.join(repo, entry), "line\n".repeat(30), "utf8"));
    const ctx = makeGuardCtx(repo);
    await diffSizeGuard(ctx, "ses_diff_edge", "write");
    assert.equal(ctx.pendingWarnings.length, 0, "at the ceiling, no warning :: " + JSON.stringify(ctx.pendingWarnings));
  });

  // ---- RUN-0.9.0-FIX: seat-deny overlay over the shipped plural blocks ----
  // fx1 proved the host never evaluates `permissions:` (plural), so the overlay
  // reads that shipped shape itself. These cases read the real seat files: they
  // are the declarations the RUN-090 field test mis-executed.
  const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  const seatMarkdown = (agent) => fs.readFileSync(path.join(REPO_ROOT, ".opencode", "agents", agent + ".md"), "utf8");
  const seatEvent = (agent, action, resources, overrides) => ({
    sessionID: "ses_seat",
    ...(agent === null ? {} : { agent }),
    action,
    resources,
    effect: "allow",
    ...(overrides ?? {}),
  });

  await check("SEAT shipped plural block parses; block-less and singular seats are absent", () => {
    const aether = parseSeatPermissions(seatMarkdown("aether"));
    assert.equal(aether.status, "parsed", "aether parses :: " + JSON.stringify(aether));
    assert.ok(aether.rules.length >= 20, "aether declares its full block :: " + aether.rules.length);
    assert.deepEqual(
      aether.rules[0],
      { action: "subagent", resource: "*", effect: "deny" },
      "first rule is the subagent deny",
    );
    const vantrilex = parseSeatPermissions(seatMarkdown("vantrilex"));
    assert.equal(vantrilex.status, "parsed");
    assert.ok(
      vantrilex.rules.some((rule) => rule.action === "skill" && rule.resource === "*" && rule.effect === "deny"),
      "vantrilex declares skill * deny",
    );
    assert.equal(
      parseSeatPermissions(seatMarkdown("vantrilex-fixer")).status,
      "absent",
      "a seat with no block is absent, not malformed",
    );
    assert.equal(
      parseSeatPermissions("---\nname: x\npermission:\n  read: allow\n---\n").status,
      "absent",
      "the singular shape is native and is never overlaid",
    );
  });

  await check("SEAT aether + subagent + vantrilex-scribe -> deny", async () => {
    const event = seatEvent("aether", "subagent", ["vantrilex-scribe"]);
    await seatDenyOverlay(makeGuardCtx(REPO_ROOT), event);
    assert.equal(event.effect, "deny", "effect flipped :: " + JSON.stringify(event));
    assert.ok(event.message.includes("seat-deny"), "message tagged :: " + event.message);
    assert.ok(event.message.includes("aether"), "caller named :: " + event.message);
    assert.ok(event.message.includes("vantrilex-scribe"), "target named :: " + event.message);
  });

  await check("SEAT blazar + subagent + explore -> deny", async () => {
    const event = seatEvent("blazar", "subagent", ["explore"]);
    await seatDenyOverlay(makeGuardCtx(REPO_ROOT), event);
    assert.equal(event.effect, "deny", "out-of-list dispatch denied :: " + JSON.stringify(event));
  });

  await check("SEAT vantrilex + skill + vantrilex-vanguard -> deny (allow and ask)", async () => {
    const ctx = makeGuardCtx(REPO_ROOT);
    const allow = seatEvent("vantrilex", "skill", ["vantrilex-vanguard"]);
    await seatDenyOverlay(ctx, allow);
    assert.equal(allow.effect, "deny", "allow flipped :: " + JSON.stringify(allow));
    const ask = seatEvent("vantrilex", "skill", ["vantrilex-vanguard"], { effect: "ask" });
    await seatDenyOverlay(ctx, ask);
    assert.equal(ask.effect, "deny", "ask flipped :: " + JSON.stringify(ask));
  });

  await check("SEAT blazar 13 worker allows are not denied", async () => {
    const workers = [
      "vantrilex-fixer",
      "vantrilex-github",
      "vantrilex-harness",
      "vantrilex-librarian",
      "vantrilex-python",
      "vantrilex-releaser",
      "vantrilex-reviewer",
      "vantrilex-scribe",
      "vantrilex-security-auditor",
      "vantrilex-typescript",
      "vantrilex-ui-designer",
      "vantrilex-ux-designer",
      "vantrilex-verifier",
    ];
    assert.equal(workers.length, 13, "the declared allow-list is 13 workers");
    assert.ok(!workers.includes("explore"), "explore is outside the list");
    const ctx = makeGuardCtx(REPO_ROOT);
    for (const worker of workers) {
      const event = seatEvent("blazar", "subagent", [worker]);
      await seatDenyOverlay(ctx, event);
      assert.equal(event.effect, "allow", worker + " stays allowed :: " + JSON.stringify(event));
    }
  });

  await check("SEAT blazar + subagent + vantrilex-guide -> allow", async () => {
    const event = seatEvent("blazar", "subagent", ["vantrilex-guide"]);
    await seatDenyOverlay(makeGuardCtx(REPO_ROOT), event);
    assert.equal(event.effect, "allow", "the Guide sign-off target stays allowed :: " + JSON.stringify(event));
  });

  await check("SEAT no-rule control leaves the host effect unchanged", async () => {
    const ctx = makeGuardCtx(REPO_ROOT);
    const unknown = seatEvent("not-a-seat", "subagent", ["vantrilex-scribe"]);
    await seatDenyOverlay(ctx, unknown);
    assert.equal(unknown.effect, "allow", "unknown agent unchanged :: " + JSON.stringify(unknown));
    const blockless = seatEvent("vantrilex-fixer", "skill", ["vantrilex-vanguard"]);
    await seatDenyOverlay(ctx, blockless);
    assert.equal(blockless.effect, "allow", "known seat without a block unchanged");
    const allowed = seatEvent("vantrilex", "read", ["docs/dev/01-PLUGIN.md"], { effect: "ask" });
    await seatDenyOverlay(ctx, allowed);
    assert.equal(allowed.effect, "ask", "a non-deny rule never relaxes or hardens an ask");
    const unmatched = seatEvent("blazar", "read", ["docs/dev/01-PLUGIN.md"]);
    await seatDenyOverlay(ctx, unmatched);
    assert.equal(unmatched.effect, "allow", "no matching rule unchanged");
  });

  await check("SEAT last-match-wins and * glob: vantrilex read *.env denies", async () => {
    const ctx = makeGuardCtx(REPO_ROOT);
    const env = seatEvent("vantrilex", "read", ["/proj/.env"]);
    await seatDenyOverlay(ctx, env);
    assert.equal(env.effect, "deny", "the later *.env deny wins over read * allow :: " + JSON.stringify(env));
    const plain = seatEvent("vantrilex", "read", ["docs/dev/01-PLUGIN.md"]);
    await seatDenyOverlay(ctx, plain);
    assert.equal(plain.effect, "allow", "an ordinary read still matches read * allow");
  });

  await check("SEAT _ wildcard: vantrilex denies the vercel_* namespace by action", async () => {
    const ctx = makeGuardCtx(REPO_ROOT);
    const event = seatEvent("vantrilex", "vercel_deploy", ["project"]);
    await seatDenyOverlay(ctx, event);
    assert.equal(
      event.effect,
      "deny",
      "_ matches any action and its resource glob matches the action :: " + JSON.stringify(event),
    );
  });

  await check("SEAT malformed known seat fails closed", async () => {
    const dir = path.join(PROBE_ROOT, "proj-seat-malformed");
    fs.mkdirSync(path.join(dir, ".opencode", "agents"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, ".opencode", "agents", "broken-seat.md"),
      [
        "---",
        "name: broken-seat",
        "permissions:",
        "  - action: read",
        "    resource: '*'",
        "    effect: perhaps",
        "---",
        "",
        "# broken",
        "",
      ].join("\n"),
      "utf8",
    );
    const event = seatEvent("broken-seat", "read", ["docs/dev/01-PLUGIN.md"]);
    await seatDenyOverlay(makeGuardCtx(dir), event);
    assert.equal(event.effect, "deny", "malformed block denies :: " + JSON.stringify(event));
    assert.ok(event.message.includes("malformed"), "reason names the defect :: " + event.message);
    assert.ok(event.message.includes("failing closed"), "reason states the posture :: " + event.message);
  });

  await check("SEAT hook registration drives the overlay end to end", async () => {
    const seen = await captureV2(REPO_ROOT);
    assert.equal(typeof seen["permission:evaluate"], "function", "permission evaluate registered");
    // No event agent: the registered `ctx.session.get` reader supplies aether.
    const event = seatEvent(null, "subagent", ["vantrilex-scribe"]);
    await seen["permission:evaluate"](event);
    assert.equal(event.effect, "deny", "session-agent fallback reached the seat :: " + JSON.stringify(event));
  });

  await check("SEAT session-agent fallback uses the observed-event cache", async () => {
    const ctx = makeGuardCtx(REPO_ROOT);
    const first = seatEvent("aether", "subagent", ["vantrilex-scribe"], { sessionID: "ses_seat_cache" });
    await seatDenyOverlay(ctx, first);
    assert.equal(first.effect, "deny", "first event names the agent and caches it");
    const second = seatEvent(null, "subagent", ["vantrilex-scribe"], { sessionID: "ses_seat_cache" });
    await seatDenyOverlay(ctx, second);
    assert.equal(second.effect, "deny", "agent-less event reuses the cached agent :: " + JSON.stringify(second));
  });

  await check("SEAT no agent anywhere leaves the host effect unchanged", async () => {
    const event = seatEvent(null, "subagent", ["vantrilex-scribe"], { sessionID: "ses_seat_none" });
    await seatDenyOverlay(makeGuardCtx(REPO_ROOT), event);
    assert.equal(event.effect, "allow", "no agent, no rule :: " + JSON.stringify(event));
  });

  await check("SEAT kill switch disarms the overlay", async () => {
    const previous = process.env.VANTRILEX_DISABLED;
    process.env.VANTRILEX_DISABLED = "1";
    try {
      const event = seatEvent("aether", "subagent", ["vantrilex-scribe"]);
      await seatDenyOverlay(makeGuardCtx(REPO_ROOT), event);
      assert.equal(event.effect, "allow", "disabled overlay leaves the effect :: " + JSON.stringify(event));
    } finally {
      if (previous === undefined) delete process.env.VANTRILEX_DISABLED;
      else process.env.VANTRILEX_DISABLED = previous;
    }
  });

  await check("SEAT explicit host deny is never touched", async () => {
    const event = seatEvent("aether", "subagent", ["vantrilex-scribe"], {
      effect: "deny",
      message: "host denied",
    });
    await seatDenyOverlay(makeGuardCtx(REPO_ROOT), event);
    assert.equal(event.effect, "deny", "still denied");
    assert.equal(event.message, "host denied", "host reason preserved");
  });

  await check("SEAT dispatcher no longer orders a denied skill", () => {
    const text = taskDispatcher(makeGuardCtx(proj));
    assert.ok(text !== null, "dispatcher armed");
    assert.ok(
      text.includes("if the seat denies the skill, record it and apply the rule"),
      "deny fallback stated :: " + text,
    );
    assert.ok(
      text.includes("run that scenario's playbook in the vantrilex-vanguard skill when the seat allows it"),
      "skill load is conditional :: " + text,
    );
    assert.ok(!text.includes("vantrilex-vanguard skill;"), "no unconditional skill order survives :: " + text);
  });

  // ---- ق-6 single-plugin load smoke ----
  await check("Q6 the retired carrier is gone (one plugin file loads)", () => {
    const carrier = new URL("../plugins/vantrilex-guards.ts", import.meta.url);
    assert.equal(fs.existsSync(carrier), false, "carrier file must not exist");
    const source = fs.readFileSync(new URL("./arsenal.ts", import.meta.url), "utf8");
    assert.ok(source.includes("appendPlanDriftReport"), "plan guard lives in arsenal.ts");
  });

  console.log("probe: " + passed + " checks passed");
};

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invoked) {
  await main();
}
