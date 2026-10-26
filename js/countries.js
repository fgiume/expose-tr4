/* EXPOSE – interactive countries map. No external libraries. */
(function () {
  "use strict";

  var WORLD = window.EXPOSE_WORLD || [];
  var REG = window.EXPOSE_REGIMES || {};
  var LIST = window.EXPOSE_COUNTRIES || [];
  var D = window.EXPOSE_DATA || { regimes: [], cases: [] };
  var SRC = "https://unsanctionsapp.com/cases/";
  var UNSC = "https://main.un.org/securitycouncil/en/sanctions/information";

  function yearOf(t) { var m = /\d{4}/.exec(t || ""); return m ? +m[0] : 0; }
  LIST.forEach(function (c) {
    c.rs = c.regimes.map(function (k) { return REG[k]; }).filter(Boolean)
      .sort(function (a, b) { return yearOf(a.from) - yearOf(b.from); });
    c.type = c.rs.some(function (r) { return r.panel; }) ? "panel" : "sanctions";
    c.y1 = Math.min.apply(null, c.rs.map(function (r) { return yearOf(r.from); }));
    c.y2 = c.rs.some(function (r) { return r.to === "Present"; }) ? "present"
      : Math.max.apply(null, c.rs.map(function (r) { return yearOf(r.to); }));
    c.years = c.y1 + "–" + (c.y2 === "present" ? "present" : c.y2);
  });
  var NS = "http://www.w3.org/2000/svg";
  var VB_W = 960, VB_H = 500;

  var TYPES = {
    none: "No UN sanctions",
    sanctions: "UN sanctions, no Panel of Experts",
    panel: "UN sanctions + Panel of Experts"
  };

  var svg = document.getElementById("cx-map");
  var world = document.getElementById("cx-world");
  var tip = document.getElementById("cx-tip");
  var detail = document.getElementById("cx-detail");
  if (!svg || !world || !WORLD.length) return;

  var byId = {};
  LIST.forEach(function (c) { byId[c.id] = c; });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function keyOf(w) { return w.id === "000" ? "x-" + w.n : w.id; }
  function typeOf(id) { return byId[id] ? byId[id].type : "none"; }
  function nameOf(id, fallback) { return byId[id] ? byId[id].name : fallback; }

  /* ---------- draw the map ---------- */
  var order = { none: 0, sanctions: 1, panel: 2 };
  var items = WORLD.slice().sort(function (a, b) { return order[typeOf(keyOf(a))] - order[typeOf(keyOf(b))]; });
  var pathsById = {};

  items.forEach(function (w) {
    var k = keyOf(w);
    var t = typeOf(k);
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", w.d);
    p.setAttribute("class", "c c-" + t);
    p.setAttribute("data-id", k);
    p.setAttribute("data-name", nameOf(k, w.n));
    if (t !== "none") {
      p.setAttribute("tabindex", "0");
      p.setAttribute("role", "button");
      p.setAttribute("aria-label", nameOf(k, w.n) + ": " + TYPES[t]);
    }
    world.appendChild(p);
    (pathsById[k] = pathsById[k] || []).push(p);
  });

  /* ---------- zoom and pan ---------- */
  var view = { x: 0, y: 0, w: VB_W, h: VB_H };
  function applyView() { svg.setAttribute("viewBox", view.x + " " + view.y + " " + view.w + " " + view.h); }
  function clamp() {
    view.x = Math.max(0, Math.min(VB_W - view.w, view.x));
    view.y = Math.max(0, Math.min(VB_H - view.h, view.y));
  }
  function zoomBy(f, cx, cy) {
    var nw = Math.max(VB_W / 12, Math.min(VB_W, view.w / f));
    var nh = nw * VB_H / VB_W;
    var rx = (cx - view.x) / view.w, ry = (cy - view.y) / view.h;
    view.x = cx - rx * nw; view.y = cy - ry * nh; view.w = nw; view.h = nh;
    clamp(); applyView();
    svg.classList.toggle("zoomed", view.w < VB_W - 1);
  }
  function toMap(clientX, clientY) {
    var r = svg.getBoundingClientRect();
    return { x: view.x + (clientX - r.left) / r.width * view.w, y: view.y + (clientY - r.top) / r.height * view.h };
  }
  function resetView() { view = { x: 0, y: 0, w: VB_W, h: VB_H }; applyView(); svg.classList.remove("zoomed"); }
  function zoomCenter(f) { zoomBy(f, view.x + view.w / 2, view.y + view.h / 2); }

  document.getElementById("cx-zin").addEventListener("click", function () { zoomCenter(1.6); });
  document.getElementById("cx-zout").addEventListener("click", function () { zoomCenter(1 / 1.6); });
  document.getElementById("cx-zreset").addEventListener("click", resetView);

  svg.addEventListener("wheel", function (e) {
    if (!(e.ctrlKey || e.metaKey)) return; // normal scroll keeps scrolling the page
    e.preventDefault();
    var m = toMap(e.clientX, e.clientY);
    zoomBy(e.deltaY < 0 ? 1.25 : 1 / 1.25, m.x, m.y);
  }, { passive: false });

  var drag = null, moved = false;
  svg.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    moved = false;
  });
  window.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    if (!moved || view.w >= VB_W - 1) return;
    var r = svg.getBoundingClientRect();
    view.x = drag.vx - dx / r.width * view.w;
    view.y = drag.vy - dy / r.height * view.h;
    clamp(); applyView();
    tip.hidden = true;
  });
  window.addEventListener("pointerup", function () { drag = null; });

  /* ---------- tooltip ---------- */
  var wrap = svg.parentNode;
  svg.addEventListener("mousemove", function (e) {
    var id = e.target.getAttribute && e.target.getAttribute("data-id");
    if (!id || drag) { tip.hidden = true; return; }
    var t = typeOf(id);
    tip.innerHTML = "";
    tip.appendChild(el("strong", null, e.target.getAttribute("data-name")));
    tip.appendChild(el("span", "tt tt-" + t, TYPES[t]));
    var r = wrap.getBoundingClientRect();
    tip.style.left = Math.min(e.clientX - r.left + 14, r.width - 220) + "px";
    tip.style.top = (e.clientY - r.top + 14) + "px";
    tip.hidden = false;
  });
  svg.addEventListener("mouseleave", function () { tip.hidden = true; });

  /* ---------- details panel ---------- */
  var selected = null;

  function tags(list) {
    var ul = el("ul", "tags");
    list.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    return ul;
  }
  function fact(dl, k, node) {
    dl.appendChild(el("dt", null, k));
    var dd = el("dd");
    if (typeof node === "string") dd.textContent = node; else dd.appendChild(node);
    dl.appendChild(dd);
  }

  function regimeCard(r) {
    var card = el("section", "rg " + (r.panel ? "rg-panel" : "rg-nopanel"));
    var head = el("div", "rg-head");
    head.appendChild(el("h4", null, r.name));
    head.appendChild(el("span", "tag-pill " + (r.panel ? "tp-panel" : "tp-none"), r.panel ? "Panel of Experts" : "No Panel"));
    card.appendChild(head);

    var dl = el("dl", "facts");
    var period = el("span");
    period.appendChild(el("strong", null, r.from + " – " + r.to));
    period.appendChild(document.createTextNode("  ·  " + r.status));
    fact(dl, "Sanctions period", period);
    fact(dl, "Type of sanctions", tags(r.types));
    card.appendChild(dl);

    (r.notes || []).forEach(function (n) { card.appendChild(el("p", "rg-note", n)); });

    if (r.episodes && r.episodes.length) {
      card.appendChild(el("h5", null, "Episodes (" + r.episodes.length + ")"));
      var ol = el("ol", "eps");
      r.episodes.forEach(function (e, i) {
        var li = el("li");
        li.appendChild(el("span", "ep-n", "Episode " + (i + 1)));
        li.appendChild(el("span", "ep-d", e[0] + " – " + e[1]));
        ol.appendChild(li);
      });
      card.appendChild(ol);
    } else if (r.outside) {
      card.appendChild(el("p", "rg-warn", "This regime pre-dates UN SanctionsApp (which starts in 1991), so there is no episode breakdown. The dates come from Security Council resolutions: please check them."));
    } else if (r.provisional) {
      card.appendChild(el("p", "rg-warn", "Provisional: the episode dates are not loaded yet and the period and types may be incomplete. Check the case page below."));
    }

    var foot = el("p", "rg-src");
    var a = el("a", null, r.slug ? "See this case on UN SanctionsApp ↗" : "UN Security Council sanctions pages ↗");
    a.href = r.slug ? SRC + r.slug : UNSC;
    a.target = "_blank"; a.rel = "noopener";
    foot.appendChild(a);
    if (r.db) {
      var n = (D.cases || []).filter(function (x) { return x.regime === r.db; }).length;
      if (n) {
        var b = el("a", "btn btn-primary btn-sm", n + (n === 1 ? " case" : " cases") + " in our database →");
        b.href = "database.html?regime=" + encodeURIComponent(r.db);
        foot.appendChild(b);
      }
    }
    card.appendChild(foot);
    return card;
  }

  function showDetail(id, fallbackName) {
    var c = byId[id], t = typeOf(id);
    detail.innerHTML = "";
    detail.appendChild(el("span", "badge badge-" + t, TYPES[t]));
    detail.appendChild(el("h3", null, c ? c.name : fallbackName));

    if (!c) {
      detail.appendChild(el("p", null, "No UN Security Council sanctions regime has been applied to this country, so it is outside the scope of the EXPOSE dataset."));
      detail.appendChild(el("p", "small", "It may still be subject to autonomous sanctions imposed by the EU, the US or others. EXPOSE covers UN sanctions only."));
      return;
    }
    if (c.note) detail.appendChild(el("p", "small", c.note));
    c.rs.forEach(function (r) { detail.appendChild(regimeCard(r)); });
  }

  function select(id, name, scroll) {
    if (selected && pathsById[selected]) pathsById[selected].forEach(function (p) { p.classList.remove("sel"); });
    selected = id;
    (pathsById[id] || []).forEach(function (p) { p.classList.add("sel"); world.appendChild(p); });
    showDetail(id, name || nameOf(id, id));
    try { history.replaceState(null, "", "?c=" + id); } catch (e) {}
    document.querySelectorAll(".cx-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-id") === id)); });
    if (scroll) document.getElementById("cx-stage").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  svg.addEventListener("click", function (e) {
    if (moved) { moved = false; return; }
    var id = e.target.getAttribute && e.target.getAttribute("data-id");
    if (id) select(id, e.target.getAttribute("data-name"));
  });
  svg.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var id = e.target.getAttribute && e.target.getAttribute("data-id");
    if (id) { e.preventDefault(); select(id, e.target.getAttribute("data-name")); }
  });

  /* ---------- legend (counts + show/hide) ---------- */
  var counts = { none: 0, sanctions: 0, panel: 0 };
  var seen = {};
  WORLD.forEach(function (w) { var k = keyOf(w); if (!seen[k]) { seen[k] = 1; counts[typeOf(k)]++; } });

  document.querySelectorAll(".cx-legend button").forEach(function (b) {
    var t = b.getAttribute("data-type");
    var n = b.querySelector(".n");
    if (n) n.textContent = counts[t];
    b.addEventListener("click", function () {
      var on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", String(!on));
      svg.classList.toggle("hide-" + t, on);
      var list = document.getElementById("cx-list-" + t);
      if (list) list.hidden = on;
    });
  });

  /* ---------- country lists under the map ---------- */
  function fillList(type) {
    var box = document.getElementById("cx-chips-" + type);
    if (!box) return;
    LIST.filter(function (c) { return c.type === type; })
      .sort(function (a, b) { return a.name.localeCompare(b.name); })
      .forEach(function (c) {
        var b = el("button", "cx-chip cx-chip-" + type);
        b.type = "button";
        b.setAttribute("data-id", c.id);
        b.setAttribute("aria-pressed", "false");
        b.appendChild(el("span", "nm", c.name));
        b.appendChild(el("span", "yr", c.global ? "Global regime · " + c.years : c.years));
        b.addEventListener("click", function () { select(c.id, c.name, true); });
        box.appendChild(b);
      });
  }
  fillList("panel");
  fillList("sanctions");

  /* ---------- initial state ---------- */
  var q = /[?&]c=([\w-]+)/.exec(location.search);
  if (q && pathsById[q[1]]) select(q[1]);
})();
