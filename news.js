/**
 * Public-door news: ticker on the splash + expandable archive on News.
 *
 * GET news-feed.json (generated from CHANGELOG.d, same audience as in-game
 * ``changes``). textContent only; never innerHTML. Missing file keeps the
 * static HTML fallback.
 */
(function () {
  "use strict";

  var TICK_MS = 7000;
  var items = [];
  var tickerIndex = 0;
  var tickerTimer = null;
  var tickerPaused = false;
  var tickerRoot = null;

  function slugOf(item, i) {
    if (item && item.slug) {
      return String(item.slug);
    }
    return "ship-" + String(i);
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function fullText(item) {
    if (!item) {
      return "";
    }
    if (item.body) {
      return String(item.body);
    }
    var parts = [];
    if (item.summary) {
      parts.push(item.summary);
    }
    if (item.try) {
      parts.push(item.try);
    }
    return parts.join(" ");
  }

  function stopTicker() {
    if (tickerTimer) {
      window.clearInterval(tickerTimer);
      tickerTimer = null;
    }
  }

  function startTicker() {
    stopTicker();
    if (tickerPaused || prefersReducedMotion() || items.length < 2) {
      return;
    }
    if (document.hidden) {
      return;
    }
    tickerTimer = window.setInterval(function () {
      showTickerAt((tickerIndex + 1) % items.length, false);
    }, TICK_MS);
  }

  function showTickerAt(i, userMove) {
    if (!tickerRoot || !items.length) {
      return;
    }
    tickerIndex = (i + items.length) % items.length;
    var item = items[tickerIndex];
    var btn = tickerRoot.querySelector("[data-news-current]");
    var pos = tickerRoot.querySelector("[data-news-pos]");
    if (btn) {
      btn.textContent = "";
      if (item.date) {
        var time = document.createElement("time");
        time.textContent = item.date;
        if (item.sort_ts) {
          time.setAttribute("datetime", item.sort_ts);
        }
        btn.appendChild(time);
      }
      var line = document.createElement("span");
      line.className = "news-ticker-summary";
      line.textContent = item.summary || "";
      btn.appendChild(line);
      btn.setAttribute("href", "news.html#" + encodeURIComponent(slugOf(item, tickerIndex)));
    }
    if (pos) {
      pos.textContent =
        String(tickerIndex + 1) + " of " + String(items.length);
    }
    if (userMove) {
      startTicker();
    }
  }

  function bindTicker(root) {
    tickerRoot = root;
    root.textContent = "";
    root.classList.add("news-ticker-ready");

    var label = document.createElement("p");
    label.className = "news-ticker-label";
    label.textContent = "News";
    root.appendChild(label);

    var current = document.createElement("a");
    current.className = "news-ticker-current";
    current.setAttribute("data-news-current", "");
    current.setAttribute("aria-live", "polite");
    root.appendChild(current);

    var controls = document.createElement("div");
    controls.className = "news-ticker-controls";

    function addBtn(name, text, fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-news-" + name, "");
      b.textContent = text;
      b.addEventListener("click", fn);
      controls.appendChild(b);
    }

    addBtn("prev", "Previous", function () {
      showTickerAt(tickerIndex - 1, true);
    });
    addBtn("next", "Next", function () {
      showTickerAt(tickerIndex + 1, true);
    });

    var pos = document.createElement("span");
    pos.setAttribute("data-news-pos", "");
    pos.className = "news-ticker-pos";
    controls.appendChild(pos);

    var all = document.createElement("a");
    all.href = "news.html";
    all.className = "news-ticker-all";
    all.textContent = "All news";
    controls.appendChild(all);

    root.appendChild(controls);

    function pause() {
      tickerPaused = true;
      stopTicker();
    }
    function resume() {
      tickerPaused = false;
      startTicker();
    }
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", function (ev) {
      if (!root.contains(ev.relatedTarget)) {
        resume();
      }
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopTicker();
      } else if (!tickerPaused) {
        startTicker();
      }
    });

    showTickerAt(0, false);
    startTicker();
  }

  function openHash(list) {
    var raw = (window.location.hash || "").replace(/^#/, "");
    if (!raw) {
      return;
    }
    var want = decodeURIComponent(raw);
    var nodes = list.querySelectorAll("details[id]");
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      if (nodes[i].id === want) {
        nodes[i].open = true;
        nodes[i].scrollIntoView({ block: "start" });
        return;
      }
    }
  }

  function paintList(list) {
    list.textContent = "";
    var i;
    for (i = 0; i < items.length; i += 1) {
      var item = items[i];
      if (!item || !item.summary) {
        continue;
      }
      var details = document.createElement("details");
      details.className = "news-item";
      details.id = slugOf(item, i);

      var summaryEl = document.createElement("summary");
      if (item.date) {
        var time = document.createElement("time");
        time.textContent = item.date;
        if (item.sort_ts) {
          time.setAttribute("datetime", item.sort_ts);
        }
        summaryEl.appendChild(time);
      }
      var head = document.createElement("span");
      head.className = "news-item-head";
      head.textContent = item.summary;
      summaryEl.appendChild(head);
      details.appendChild(summaryEl);

      var body = document.createElement("div");
      body.className = "news-item-body";
      var prose = document.createElement("p");
      prose.textContent = fullText(item);
      body.appendChild(prose);
      details.appendChild(body);
      list.appendChild(details);
    }
    openHash(list);
  }

  fetch("news-feed.json", { cache: "no-store" })
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .then(function (data) {
      if (!data || !data.items || !data.items.length) {
        return;
      }
      items = data.items;
      var ticker = document.querySelector("[data-news-ticker]");
      if (ticker) {
        bindTicker(ticker);
      }
      var list = document.querySelector("[data-news-list]");
      if (list) {
        paintList(list);
      }
    })
    .catch(function () {
      /* keep HTML fallback */
    });

  window.addEventListener("hashchange", function () {
    var list = document.querySelector("[data-news-list]");
    if (list) {
      openHash(list);
    }
  });
})();
