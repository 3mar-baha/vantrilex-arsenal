/* comms-supabase-dashboard app.js — LIVE-FIRST chat shell.
   Data path: Supabase REST on open. Endpoint + anon key come ONLY from
   browser prompt -> localStorage (dash.supabase.url / dash.supabase.anon).
   No config file is fetched, written, or required. ntfy topic comes ONLY
   from localStorage (dash.ntfy.topic). Nothing secret is logged; stored
   keys are never rendered into the DOM. ?test=1 disables all ntfy POST.
   Fixtures (fixtures/messages.json) render ONLY when no stored key exists,
   behind a persistent DEMO banner — never as proof. Poll every 5000 ms. */
(function () {
  "use strict";

  var POLL_MS = 5000;
  var LIMIT = 100;
  var LS_URL = "dash.supabase.url";
  var LS_ANON = "dash.supabase.anon";
  var LS_TOPIC = "dash.ntfy.topic";
  var LS_MASTER = "dash.ntfy.master";
  var LS_PROMPTED = "dash.prompted";

  var page = document.body.getAttribute("data-page");
  var TEST = /[?&]test=1/.test(location.search);
  var store = readStore();
  var LIVE = !!(store.url && store.anon);
  var msgs = [];
  var threads = [];
  var selected = null;
  var query = "";
  var firstLoad = true;
  var seenIds = {};

  function $(id) { return document.getElementById(id); }

  function readStore() {
    var o = { url: "", anon: "", topic: "", master: false };
    try {
      o.url = (localStorage.getItem(LS_URL) || "").replace(/\/$/, "");
      o.anon = localStorage.getItem(LS_ANON) || "";
      o.topic = localStorage.getItem(LS_TOPIC) || "";
      o.master = localStorage.getItem(LS_MASTER) === "1";
    } catch (e) { /* storage unavailable: session-only demo */ }
    return o;
  }
  function saveStore() {
    try {
      if (store.url) localStorage.setItem(LS_URL, store.url); else localStorage.removeItem(LS_URL);
      if (store.anon) localStorage.setItem(LS_ANON, store.anon); else localStorage.removeItem(LS_ANON);
      if (store.topic) localStorage.setItem(LS_TOPIC, store.topic); else localStorage.removeItem(LS_TOPIC);
      localStorage.setItem(LS_MASTER, store.master ? "1" : "0");
      localStorage.setItem(LS_PROMPTED, "1");
    } catch (e) { /* session-only */ }
  }

  /* First-run prompt (browser prompt -> localStorage). Blank keeps old
     value on re-entry; typing off clears keys back to demo. */
  function promptKeys(first) {
    var url = window.prompt(
      (first ? "الاتصال بالبث المباشر — live setup.\n" : "الإعدادات — settings (blank keeps, off = demo).\n") +
      "Supabase URL (https://<ref>.supabase.co):", "");
    if (url === null) return false;
    url = url.trim().replace(/\/$/, "");
    if (url.toLowerCase() === "off") {
      store.url = ""; store.anon = ""; store.topic = "";
      LIVE = false; saveStore(); return true;
    }
    if (url && !/^https:\/\//.test(url)) {
      alert("URL must start with https:// — يجب أن يبدأ بـ https://");
      return false;
    }
    var anon = window.prompt("Supabase anon key (publishable, never the service key):", "");
    if (anon === null) return false;
    anon = anon.trim();
    var topic = window.prompt("ntfy topic (optional, owner topic for alerts):", "");
    if (topic === null) return false;
    topic = topic.trim();
    if (url) store.url = url;
    if (anon) {
      if (anon.length < 20) { alert("Key looks too short — المفتاح قصير."); return false; }
      store.anon = anon;
    }
    if (topic) store.topic = topic;
    LIVE = !!(store.url && store.anon);
    saveStore();
    return true;
  }

  function statusOf(m) {
    if (m.acked_at) return "acked";
    if (m.claimed_by) return "claimed";
    return "pending";
  }
  function threadKey(m) {
    var parts = [m.from_agent].concat(m.to_agents || []).slice().sort();
    return m.project + " :: " + parts.join(" + ");
  }
  function threadId(key) {
    var h = 0, i;
    for (i = 0; i < key.length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0;
    return "t" + (h >>> 0).toString(36);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fmtTime(iso) {
    try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
  }
  function senderClass(name) {
    var h = 0, i;
    name = String(name || "?");
    for (i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    return "s" + ((h >>> 0) % 6);
  }

  function headers() {
    return {
      "apikey": store.anon,
      "Authorization": "Bearer " + store.anon,
      "Content-Type": "application/json"
    };
  }
  function loadMessages() {
    if (LIVE) {
      var url = store.url +
        "/rest/v1/messages?select=id,from_agent,to_agents,project,title,body,needs_user_action,created_at,claimed_by,claimed_at,acked_at" +
        "&order=created_at.desc&limit=" + LIMIT;
      return fetch(url, { headers: headers() }).then(function (r) {
        if (!r.ok) throw new Error("live " + r.status);
        return r.json();
      });
    }
    return fetch("fixtures/messages.json").then(function (r) { return r.json(); });
  }

  function groupThreads(list) {
    var map = {};
    list.forEach(function (m) {
      var k = threadKey(m);
      if (!map[k]) map[k] = { key: k, id: threadId(k), project: m.project, msgs: [] };
      map[k].msgs.push(m);
    });
    var out = Object.keys(map).map(function (k) { return map[k]; });
    out.forEach(function (t) {
      t.counts = { pending: 0, claimed: 0, acked: 0 };
      t.pinned = false;
      t.latest = "";
      t.preview = "";
      t.msgs.forEach(function (m) {
        t.counts[statusOf(m)]++;
        if (m.needs_user_action) t.pinned = true;
        if (m.created_at > t.latest) { t.latest = m.created_at; t.preview = m.title; }
      });
    });
    out.sort(function (a, b) {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.latest < a.latest ? -1 : 1;
    });
    return out;
  }

  /* ntfy: master + per-thread, topic from localStorage only, never in tests */
  function toggleKey(tid) { return "ntfy:" + tid; }
  function toggleOn(tid) {
    try { return localStorage.getItem(toggleKey(tid)) === "1"; } catch (e) { return false; }
  }
  function setToggle(tid, on) {
    try {
      if (on) localStorage.setItem(toggleKey(tid), "1");
      else localStorage.removeItem(toggleKey(tid));
    } catch (e) { /* session-only */ }
  }
  function buzz(threadTitle, msgTitle) {
    if (TEST || !LIVE || !store.master || !store.topic) return;
    fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Topic": store.topic, "Title": "comms: " + threadTitle },
      body: String(msgTitle)
    }).catch(function () { /* fire-and-forget; topic never logged */ });
  }
  function checkNew(list) {
    if (firstLoad) {
      list.forEach(function (m) { seenIds[m.id] = 1; });
      firstLoad = false;
      return;
    }
    list.forEach(function (m) {
      if (seenIds[m.id]) return;
      seenIds[m.id] = 1;
      threads.forEach(function (t) {
        if (threadKey(m) === t.key && toggleOn(t.id)) buzz(t.key, m.title);
      });
    });
  }

  function setConn(state, text) {
    var badge = $("connBadge");
    if (!badge) return;
    badge.setAttribute("data-state", state);
    $("connText").textContent = text;
  }
  function setBanner() {
    var b = $("modeBanner");
    if (!b) return;
    if (!LIVE) {
      b.innerHTML = "عرض تجريبي — <strong>DEMO (fixtures)</strong> · " +
        "offline fallback only, never proof · " +
        '<button type="button" id="connectBtn" class="ghost">اتصال بالبث المباشر · connect live</button>';
      var c = $("connectBtn");
      if (c) c.addEventListener("click", function () {
        if (promptKeys(false)) boot(true);
      });
    } else {
      b.textContent = "";
      b.removeAttribute("data-demo");
    }
    if (!LIVE) b.setAttribute("data-demo", "1");
  }

  function pill(name, n) {
    var ar = { pending: "بانتظار", claimed: "مُستلم", acked: "مؤكد" }[name];
    return '<span class="pill ' + name + '">' + ar + " · " + name + " " + n + "</span>";
  }

  function visibleThreads() {
    if (!query) return threads;
    var q = query.toLowerCase();
    return threads.filter(function (t) {
      if (t.key.toLowerCase().indexOf(q) !== -1) return true;
      return t.msgs.some(function (m) {
        return String(m.title + " " + m.body).toLowerCase().indexOf(q) !== -1;
      });
    });
  }

  function renderSidebar() {
    var list = $("threadList");
    var vis = visibleThreads();
    if (!vis.length) {
      list.innerHTML = "<li class='empty'>" +
        (msgs.length ? "لا نتائج للبحث — no matches." : "لا رسائل — no messages.") + "</li>";
      return;
    }
    list.innerHTML = vis.map(function (t) {
      var pin = t.pinned
        ? '<span class="pin" aria-label="needs user action">⚑ تحتاج تدخلك · needs-action</span>' : "";
      var unread = t.counts.pending > 0
        ? '<span class="unread" aria-label="' + t.counts.pending + ' غير مؤكدة · unread">' + t.counts.pending + "</span>" : "";
      var on = toggleOn(t.id);
      return '<li class="thread' + (t.pinned ? " pinned" : "") +
        (t.id === selected ? " active" : "") + '">' +
        '<a class="thread-main" href="#/t/' + t.id + '" data-tid="' + t.id + '">' +
        '<span class="thread-top"><span class="thread-name">' + esc(t.key) + "</span>" + unread + "</span>" +
        '<span class="thread-preview">' + esc(t.preview || "") + "</span>" +
        '<span class="thread-meta-line"><time>' + esc(fmtTime(t.latest)) + "</time> · " +
        t.msgs.length + " رسائل · " + t.counts.pending + " pending</span>" + pin + "</a>" +
        '<button type="button" class="mini-toggle' + (on ? " on" : "") + '" data-ntfy="' + t.id + '" ' +
        'aria-pressed="' + on + '" aria-label="ntfy alerts for ' + esc(t.key) + '" title="ntfy">ntfy ' +
        (on ? "ON" : "OFF") + "</button></li>";
    }).join("");
    list.querySelectorAll("a.thread-main").forEach(function (a) {
      a.addEventListener("click", function () { select(a.getAttribute("data-tid")); });
    });
    list.querySelectorAll("button[data-ntfy]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var tid = btn.getAttribute("data-ntfy");
        if (!toggleOn(tid) && !store.topic) {
          $("ntfyNote").textContent = "لا يوجد موضوع ntfy محفوظ — no stored topic. افتح ⚙ وأدخل الموضوع أولًا.";
          return;
        }
        setToggle(tid, !toggleOn(tid));
        renderSidebar(); syncHeaderToggle();
      });
    });
  }

  function syncHeaderToggle() {
    var box = $("ntfyToggle");
    if (box) box.checked = selected ? toggleOn(selected) : false;
  }

  function msgHtml(m) {
    var st = statusOf(m);
    var own = m.from_agent === "dashboard";
    var need = m.needs_user_action
      ? '<span class="pin">⚑ تحتاج تدخلك · needs-action</span>' : "";
    var claim = (!m.claimed_by && !m.acked_at)
      ? '<button type="button" class="ghost" data-act="claim" data-mid="' + esc(m.id) + '">استلام · claim</button>' : "";
    var ack = (!m.acked_at && m.claimed_by)
      ? '<button type="button" class="ghost" data-act="ack" data-mid="' + esc(m.id) + '">تأكيد · ack</button>' : "";
    return '<li class="msg' + (own ? " own" : "") + '" id="m-' + esc(m.id) + '">' +
      '<div class="msg-head"><span class="sender ' + senderClass(m.from_agent) + '">' +
      esc(m.from_agent) + "</span>" +
      '<span class="to">→ ' + esc((m.to_agents || []).join(", ")) + "</span>" +
      '<time datetime="' + esc(m.created_at) + '">' + esc(fmtTime(m.created_at)) + "</time></div>" +
      "<h3>" + esc(m.title) + "</h3>" +
      '<div class="pills">' + pill(st, 1) + need + "</div>" +
      '<p class="body">' + esc(m.body) + "</p>" +
      '<div class="actions">' + claim + ack + "</div></li>";
  }

  function current() {
    for (var i = 0; i < threads.length; i++) {
      if (threads[i].id === selected) return threads[i];
    }
    return null;
  }

  function renderMain(flashId) {
    var t = current();
    var list = $("msgList");
    if (!t) {
      $("threadTitle").textContent = "اختر خيطًا · pick a thread";
      $("threadMeta").innerHTML = "";
      list.innerHTML = "<li class='empty'>" +
        (LIVE ? "متصل — لا رسائل بعد · live, empty." : "وضع التجربة — fixtures فقط · demo fixtures only.") + "</li>";
      syncHeaderToggle();
      return;
    }
    $("threadTitle").textContent = t.key;
    $("threadMeta").innerHTML =
      pill("pending", t.counts.pending) + pill("claimed", t.counts.claimed) + pill("acked", t.counts.acked);
    var sorted = t.msgs.slice().sort(function (a, b) { return a.created_at < b.created_at ? -1 : 1; });
    list.innerHTML = sorted.map(msgHtml).join("");
    if (flashId) {
      var el = document.getElementById("m-" + flashId);
      if (el) { el.classList.add("flash"); el.scrollIntoView({ block: "nearest" }); }
    }
    syncHeaderToggle();
    bindActions();
  }

  function bindActions() {
    $("msgList").querySelectorAll("button[data-act]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mid = btn.getAttribute("data-mid");
        var act = btn.getAttribute("data-act");
        if (!LIVE) {
          $("sendNote").textContent = "وضع التجربة: الزر يعمل على Live فقط — demo, live only.";
          return;
        }
        var payload = act === "claim"
          ? { claimed_by: "dashboard", claimed_at: new Date().toISOString() }
          : { acked_at: new Date().toISOString() };
        var cond = act === "claim" ? "&claimed_by=is.null" : "&acked_at=is.null";
        fetch(store.url + "/rest/v1/messages?id=eq." + encodeURIComponent(mid) + cond, {
          method: "PATCH", headers: headers(), body: JSON.stringify(payload)
        }).then(function () { tick(mid); });
      });
    });
  }

  function select(tid) {
    selected = tid;
    if (location.hash !== "#/t/" + tid) history.replaceState(null, "", "#/t/" + tid);
    renderSidebar();
    renderMain();
  }

  function tick(flashId) {
    loadMessages().then(function (data) {
      msgs = data || [];
      threads = groupThreads(msgs);
      checkNew(msgs);
      if (!current()) {
        selected = threads.length ? threads[0].id : null;
        if (selected) history.replaceState(null, "", "#/t/" + selected);
      }
      setConn("live", LIVE
        ? "مباشر — live · آخر تحديث " + new Date().toLocaleTimeString()
        : "عرض تجريبي — demo (fixtures) · آخر تحديث " + new Date().toLocaleTimeString());
      renderSidebar();
      renderMain(flashId);
    }).catch(function () {
      setConn("err", LIVE ? "تعذر الاتصال — connection failed · retrying" : "تعذر تحميل fixtures — load failed");
    });
  }

  function hashTid() {
    var m = /#\/t\/([A-Za-z0-9]+)/.exec(location.hash);
    if (m) return m[1];
    var q = /[?&]id=([^&]+)/.exec(location.search);
    return q ? decodeURIComponent(q[1]) : null;
  }

  function boot(reselect) {
    store = readStore();
    LIVE = !!(store.url && store.anon);
    if (reselect) { firstLoad = true; seenIds = {}; }
    setBanner();
    var mt = $("masterToggle");
    if (mt) mt.checked = store.master;
    selected = hashTid();
    tick();
  }

  /* wiring */
  var search = $("search");
  if (search) search.addEventListener("input", function () {
    query = search.value.trim();
    renderSidebar();
  });
  var mt0 = $("masterToggle");
  if (mt0) mt0.addEventListener("change", function () {
    store.master = mt0.checked;
    saveStore();
    $("ntfyNote").textContent = store.master
      ? "التنبيهات الرئيسية ON — master ON (per-thread toggle still required)."
      : "التنبيهات الرئيسية OFF — master OFF (no posts).";
  });
  var rb = $("refreshBtn");
  if (rb) rb.addEventListener("click", function () { tick(); });
  var st = $("settingsBtn");
  if (st) st.addEventListener("click", function () {
    if (promptKeys(false)) boot(true);
  });
  var hb = $("ntfyToggle");
  if (hb) hb.addEventListener("change", function () {
    if (!selected) { hb.checked = false; return; }
    if (hb.checked && !store.topic) {
      hb.checked = false;
      $("ntfyNote").textContent = "لا يوجد موضوع ntfy محفوظ — no stored topic. افتح ⚙ وأدخل الموضوع أولًا.";
      return;
    }
    setToggle(selected, hb.checked);
    renderSidebar();
  });
  window.addEventListener("hashchange", function () {
    var tid = hashTid();
    if (tid && tid !== selected) select(tid);
  });
  var form = $("sendForm");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var title = $("fTitle").value.trim();
    var body = $("fBody").value.trim();
    if (!title || !body) return;
    if (!LIVE) {
      $("sendNote").textContent = "وضع التجربة: تُحفظ الرسالة محليًا فقط — demo, kept locally only.";
      return;
    }
    var t = current();
    var to = ["vanbu"];
    try { if (t) to = t.key.split(" :: ")[1].split(" + "); } catch (err) { /* default */ }
    fetch(store.url + "/rest/v1/messages", {
      method: "POST", headers: headers(),
      body: JSON.stringify({
        from_agent: "dashboard", to_agents: to,
        project: t ? t.project : "vta-comms",
        title: title, body: body, needs_user_action: $("fNeeds").checked
      })
    }).then(function () {
      form.reset();
      $("sendNote").textContent = "أُرسلت — sent · live.";
      tick();
    }).catch(function () {
      $("sendNote").textContent = "فشل الإرسال — send failed · retrying.";
    });
  });

  /* first run: prompt immediately when no stored key (fixtures need no key) */
  var prompted = false;
  try { prompted = localStorage.getItem(LS_PROMPTED) === "1"; } catch (e) { prompted = true; }
  if (!store.url && !store.anon && !prompted) {
    if (promptKeys(true)) { store = readStore(); LIVE = !!(store.url && store.anon); }
    else { try { localStorage.setItem(LS_PROMPTED, "1"); } catch (e) { /* ignore */ } }
  }
  if (page === "thread" && /[?&]id=/.test(location.search) && !/#\/t\//.test(location.hash)) {
    var qid = hashTid();
    if (qid) history.replaceState(null, "", location.pathname + location.search + "#/t/" + qid);
  }
  setBanner();
  if (mt0) mt0.checked = store.master;
  selected = hashTid();
  setConn("conn", "جارٍ الاتصال… · connecting");
  tick();
  setInterval(function () { if (!document.hidden) tick(); }, POLL_MS);
})();
