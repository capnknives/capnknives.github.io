/**
 * Proof of life for the splash: GET /status.json.
 *
 * The game writes that sidecar on boot and when who-count changes.
 * Never paint "0 online" — listing shoppers read that as a dead game.
 * Missing file = keep the static Alpha line already in the HTML.
 */
(function () {
  "use strict";

  function show(node, text) {
    if (!node) {
      return;
    }
    node.hidden = false;
    node.textContent = text;
  }

  fetch("/status.json", { cache: "no-store" })
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .then(function (data) {
      if (!data || typeof data !== "object") {
        return;
      }
      var players = Number(data.players);
      if (players > 0) {
        var whoWord = players === 1 ? "player" : "players";
        show(
          document.querySelector("[data-who-line]"),
          players + " " + whoWord + " online now."
        );
      }
      // News lives in the ticker (news.js + news-feed.json), not this
      // one-line last_change sidecar.
    })
    .catch(function () {
      /* keep HTML fallback */
    });
})();
