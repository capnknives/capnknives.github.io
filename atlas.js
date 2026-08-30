/**
 * Splash atlas pins — hover/focus names for town and dungeon mouths.
 * Sites come from atlas-sites.json (generated; real geography).
 */
(function () {
  "use strict";

  var frame = document.querySelector("[data-atlas-frame]");
  var readout = document.getElementById("atlas-readout");
  if (!frame) {
    return;
  }

  function setReadout(text) {
    if (readout) {
      readout.textContent = text;
    }
  }

  function addPin(site) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "atlas-pin atlas-pin-" + site.kind;
    btn.style.left = site.left + "%";
    btn.style.top = site.top + "%";
    btn.setAttribute(
      "aria-label",
      (site.kind === "town" ? "Town: " : "Dungeon mouth: ") + site.name
    );
    btn.setAttribute("data-label", site.name);
    btn.setAttribute("data-kind", site.kind);
    function show() {
      var kind = site.kind === "town" ? "Town" : "Dungeon mouth";
      setReadout(kind + " — " + site.name);
    }
    btn.addEventListener("mouseenter", show);
    btn.addEventListener("focus", show);
    frame.appendChild(btn);
  }

  fetch("atlas-sites.json", { cache: "no-store" })
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .then(function (data) {
      if (!data) {
        return;
      }
      (data.towns || []).forEach(addPin);
      (data.dungeons || []).forEach(addPin);
    })
    .catch(function () {
      /* keep the static name list */
    });
})();
