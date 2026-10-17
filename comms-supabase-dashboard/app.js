/* comms-supabase-dashboard app.js
   Modes: LIVE (local config.js beside this file) or DEMO (fixtures/*.json).
   Local config shape (NEVER committed, git-ignored from the first commit;
   document setup lives in the handoff report, not in this repo):
     window.DASH_CONFIG = { endpoint: "https://<ref>.supabase.co",
                            anonKey: "<anon-key>", ntfyTopic: "<owner-topic>" };
   Secrets rule: endpoint/anonKey/topic are read only from window.DASH_CONFIG
   (a LOCAL file). They are never written to disk, never logged, and the ntfy
   topic value never appears in any message text or console output.
   Poll: live Supabase REST (or fixtures re-read) every 5000 ms.
   ntfy: per-thread toggle, persisted in localStorage; ON + new message +
   configured topic -> POST https://ntfy.sh/<topic>. No POST in DEMO mode
   without a topic (toggle refuses with a notice). Never POSTs during tests. */

(function () {
  "use strict";

  var POLL_MS = 5000;
  var page = document.body.getAttribute("data-page");
  var cfg = window.DASH_CONFIG || null;
  var LIVE = !!(cfg && cfg.endpoint && cfg.anonKey);
  var seenIds = {};
  var firstLoad = true;

  function $(id) { return document.getElementById(id); }

  function setMode() {
    var el = $("modeBadge");
    if (!el) return;
    if (LIVE) {
      el.textContent = "مباشر — live (Supabase)";
      el.classList.add("live");
    }
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
    var h = 0;
    for (var i = 0; i < key.length; i++) {
      h = ((h << 5) - h + key.charCodeAt(i)) | 0;
    }
    return "t" + (h >>> 0).toString(36);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function headers() {
    return {
      "apikey": cfg.anonKey,
      "Authorization": "Bearer " + cfg.anonKey,
      "Content-Type": "application/json"
    };
  }

  function loadMessages() {
    if (LIVE) {
      var url = cfg.endpoint.replace(/\/$/, "") +
        "/rest/v1/messages?select=*&order=created_at.desc&limit=100";
      return fetch(url, { headers: headers() }).then(function (r) {
        if (!r.ok) throw new Error("live fetch " + r.status);
        return r.json();
      }).catch(function () {
        return fetch("fixtures/messages.json").then(function (r) { return r.json(); });
      });
    }
    return fetch("fixtures/messages.json").then(function (r) { return r.json(); });
  }

  function groupThreads(msgs) {
    var map = {};
    msgs.forEach(function (m) {
      var k = threadKey(m);
      if (!map[k]) map[k] = { key: k, id: threadId(k), project: m.project, msgs: [] };
      map[k].msgs.push(m);
    });
    var out = Object.keys(map).map(function (k) { return map[k]; });
    out.forEach(function (t) {
      t.counts = { pending: 0, claimed: 0, acked: 0 };
      t.pinned = false;
      t.latest = t.msgs[0].created_at;
      t.msgs.forEach(function (m) {
        t.counts[statusOf(m)]++;
        if (m.needs_user_action) t.pinned = true;
        if (m.created_at > t.latest) t.latest = m.created_at;
      });
    });
    out.sort(function (a, b) {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.latest < a.latest ? -1 : 1;
    });
    return out;
  }

  /* ntfy per-thread toggle (localStorage; topic from local config only) */
  function toggleKey(tid) { return "ntfy:" + tid; }
  function toggleOn(tid) {
    try { return localStorage.getItem(toggleKey(tid)) === "1"; } catch (e) { return false; }
  }
  function setToggle(tid, on) {
    try {
      if (on) localStorage.setItem(toggleKey(tid), "1");
      else localStorage.removeItem(toggleKey(tid));
    } catch (e) { /* storage unavailable: toggle is session-only */ }
  }

  function buzz(threadTitle, msgTitle) {
    if (!(cfg && cfg.ntfyTopic)) return; /* topic from local config only */
    fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Topic": cfg.ntfyTopic, "Title": "comms: " + threadTitle },
      body: msgTitle
    }).catch(function () { /* fire-and-forget; never log the topic */ });
  }

  function checkNew(msgs, threads) {
    if (firstLoad) {
      msgs.forEach(function (m) { seenIds[m.id] = 1; });
      firstLoad = false;
      return;
    }
    msgs.forEach(function (m) {
      if (seenIds[m.id]) return;
      seenIds[m.id] = 1;
      var t = null;
      threads.forEach(function (th) {
        if (threadKey(m) === th.key) t = th;
      });
      if (t && toggleOn(t.id)) buzz(t.key, m.title);
    });
  }

  function pill(name, n) {
    var ar = { pending: "بانتظار", claimed: "مُستلم", acked: "مؤكد" }[name];
    return '<span class="pill ' + name + '">' + ar + " · " + name + " " + n + "</span>";
  }

  /* ---- index page ---- */
  function renderIndex() {
    var list = $("threadList");
    function tick() {
      loadMessages().then(function (msgs) {
        var threads = groupThreads(msgs);
        checkNew(msgs, threads);
        var html = threads.map(function (t) {
          var pin = t.pinned
            ? '<span class="pin" aria-label="needs user action">⚑ تحتاج تدخلك · needs-action</span>' : "";
          var on = toggleOn(t.id) ? "checked" : "";
          return '<li class="thread-card' + (t.pinned ? " pinned" : "") + '">' +
            '<div class="row"><h2><a href="thread.html?id=' + t.id + '">' + esc(t.key) + "</a></h2>" + pin + "</div>" +
            '<p class="pair">' + t.msgs.length + " رسائل · messages</p>" +
            '<div class="pills" aria-label="status pills">' +
            pill("pending", t.counts.pending) + pill("claimed", t.counts.claimed) + pill("acked", t.counts.acked) +
            "</div>" +
            '<label class="toggle"><input type="checkbox" data-tid="' + t.id + '" ' + on +
            ' aria-label="ntfy alerts for ' + esc(t.key) + '">' +
            "<span>تنبيه ntfy · ntfy " + (on ? "ON" : "OFF") + "</span></label>" +
            "</li>";
        }).join("");
        list.innerHTML = html || "<li>لا رسائل — no messages.</li>";
        var now = new Date();
        $("pollState").textContent = "آخر تحديث: " + now.toLocaleTimeString() +
          (LIVE ? " · live" : " · demo");
        list.querySelectorAll("input[data-tid]").forEach(function (box) {
          box.addEventListener("change", function () {
            var tid = box.getAttribute("data-tid");
            if (box.checked && !(cfg && cfg.ntfyTopic)) {
              box.checked = false;
              alert("لا يوجد موضوع ntfy في الإعداد المحلي — no ntfy topic in local config.");
              return;
            }
            setToggle(tid, box.checked);
            tick();
          });
        });
      }).catch(function () {
        list.innerHTML = "<li>تعذر التحميل — load failed.</li>";
      });
    }
    setMode();
    tick();
    setInterval(tick, POLL_MS);
  }

  /* ---- thread page ---- */
  function currentTid() {
    var m = /[?&]id=([^&]+)/.exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function renderThread() {
    var tid = currentTid();
    var list = $("msgList");
    var box = $("ntfyToggle");
    if (box) {
      box.checked = tid ? toggleOn(tid) : false;
      box.addEventListener("change", function () {
        if (box.checked && !(cfg && cfg.ntfyTopic)) {
          box.checked = false;
          $("ntfyNote").textContent = "لا يوجد موضوع ntfy في الإعداد المحلي — no ntfy topic in local config.";
          return;
        }
        if (tid) setToggle(tid, box.checked);
      });
    }
    function msgHtml(m) {
      var st = statusOf(m);
      var need = m.needs_user_action
        ? '<span class="pin">⚑ تحتاج تدخلك · needs-action</span>' : "";
      var claim = (!m.claimed_by && !m.acked_at)
        ? '<button type="button" class="ghost" data-act="claim" data-mid="' + esc(m.id) + '">استلام · claim</button>' : "";
      var ack = (!m.acked_at && m.claimed_by)
        ? '<button type="button" class="ghost" data-act="ack" data-mid="' + esc(m.id) + '">تأكيد · ack</button>' : "";
      return '<li class="msg" id="m-' + esc(m.id) + '">' +
        "<h3>" + esc(m.title) + "</h3>" +
        '<p class="meta">من ' + esc(m.from_agent) + " → " + esc((m.to_agents || []).join(", ")) +
        " · " + esc(m.created_at) +
        (m.claimed_by ? " · claimed_by " + esc(m.claimed_by) : "") +
        (m.acked_at ? " · acked " + esc(m.acked_at) : "") + "</p>" +
        '<div class="pills">' + pill(st, 1) + need + "</div>" +
        '<p class="body">' + esc(m.body) + "</p>" +
        '<div class="actions">' + claim + ack + "</div></li>";
    }
    function tick(flashId) {
      loadMessages().then(function (msgs) {
        var threads = groupThreads(msgs);
        checkNew(msgs, threads);
        var t = null;
        threads.forEach(function (th) { if (th.id === tid) t = th; });
        if (!t) {
          list.innerHTML = "<li>الخيط غير موجود — thread not found.</li>";
          return;
        }
        $("threadTitle").innerHTML = esc(t.key);
        $("threadMeta").innerHTML = '<div class="pills">' +
          pill("pending", t.counts.pending) + pill("claimed", t.counts.claimed) + pill("acked", t.counts.acked) + "</div>";
        t.msgs.sort(function (a, b) { return a.created_at < b.created_at ? -1 : 1; });
        list.innerHTML = t.msgs.map(msgHtml).join("");
        if (flashId) {
          var el = document.getElementById("m-" + flashId);
          if (el) { el.classList.add("flash"); el.scrollIntoView(); }
        }
        bindActions();
      });
    }
    function bindActions() {
      list.querySelectorAll("button[data-act]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var mid = btn.getAttribute("data-mid");
          var act = btn.getAttribute("data-act");
          if (!LIVE) {
            $("sendNote").textContent = "وضع التجربة: الزر يعمل على Live فقط — demo mode, action runs on live only.";
            return;
          }
          var payload = act === "claim"
            ? { claimed_by: "dashboard", claimed_at: new Date().toISOString() }
            : { acked_at: new Date().toISOString() };
          var cond = act === "claim" ? "&claimed_by=is.null" : "&acked_at=is.null";
          fetch(cfg.endpoint.replace(/\/$/, "") + "/rest/v1/messages?id=eq." + encodeURIComponent(mid) + cond, {
            method: "PATCH", headers: headers(), body: JSON.stringify(payload)
          }).then(function () { tick(mid); });
        });
      });
    }
    var form = $("sendForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var title = $("fTitle").value.trim();
        var body = $("fBody").value.trim();
        if (!title || !body) return;
        if (!LIVE) {
          $("sendNote").textContent = "وضع التجربة: تُحفظ الرسالة محليًا فقط — demo mode, kept locally only.";
          var li = document.createElement("li");
          li.className = "msg flash";
          li.innerHTML = "<h3>" + esc(title) + "</h3>" +
            '<div class="pills">' + pill("pending", 1) +
            ($("fNeeds").checked ? '<span class="pin">⚑ تحتاج تدخلك · needs-action</span>' : "") + "</div>" +
            '<p class="body">' + esc(body) + "</p>";
          list.appendChild(li);
          form.reset();
          return;
        }
        var t = null;
        loadMessages().then(function (msgs) {
          groupThreads(msgs).forEach(function (th) { if (th.id === tid) t = th; });
          var to = t ? t.key.split(" :: ")[1].split(" + ") : ["vanbu"];
          return fetch(cfg.endpoint.replace(/\/$/, "") + "/rest/v1/messages", {
            method: "POST", headers: headers(),
            body: JSON.stringify({
              from_agent: "dashboard", to_agents: to, project: t ? t.project : "vta-comms",
              title: title, body: body, needs_user_action: $("fNeeds").checked
            })
          });
        }).then(function () { form.reset(); tick(); });
      });
    }
    setMode();
    tick();
    setInterval(function () { tick(); }, POLL_MS);
  }

  if (page === "index") renderIndex();
  else if (page === "thread") renderThread();
})();
