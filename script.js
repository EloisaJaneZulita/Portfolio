(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Night mode ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(mode) {
    if (mode === "night") root.setAttribute("data-theme", "night");
    else root.removeAttribute("data-theme");
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", mode === "night" ? "true" : "false");
      themeBtn.setAttribute("aria-label", mode === "night" ? "Switch to day mode" : "Switch to night mode");
    }
    if (themeMeta) themeMeta.setAttribute("content", mode === "night" ? "#150A24" : "#2A1245");
  }

  function savedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }

  // First visit: follow the device setting. After that: remember the choice.
  var startTheme = savedTheme() ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day");
  applyTheme(startTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "night" ? "day" : "night";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode: ignore */ }
    });
  }

  /* ---------- Awards carousel ---------- */
  var carousel = document.getElementById("carousel");
  var track = document.getElementById("carouselTrack");
  var carouselBtn = document.getElementById("carouselToggle");

  if (carousel && track) {
    var originals = Array.prototype.slice.call(track.children);

    // Show the certificate placeholder if an image is missing.
    function watchImage(img) {
      var media = img.closest(".cert-media");
      var hide = function () { img.style.display = "none"; if (media) media.classList.add("no-image"); };
      img.addEventListener("error", hide);
      if (img.complete && img.naturalWidth === 0) hide();
    }
    originals.forEach(function (fig) {
      var img = fig.querySelector("img");
      if (img) watchImage(img);
    });

    // Clone the set once so the loop has no visible jump. Clones are hidden from screen readers.
    originals.forEach(function (fig) {
      var clone = fig.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      var cImg = clone.querySelector("img");
      if (cImg) { cImg.setAttribute("alt", ""); watchImage(cImg); }
      track.appendChild(clone);
    });

    // Measure exactly one set (cards + gaps) so the animation loops perfectly.
    function measure() {
      var first = originals[0];
      var lastOriginal = originals[originals.length - 1];
      var firstClone = track.children[originals.length];
      if (!first || !firstClone) return;
      var shift = firstClone.offsetLeft - first.offsetLeft;
      track.style.setProperty("--cert-shift", shift + "px");
      // About 60 pixels per second feels gentle and readable.
      track.style.setProperty("--cert-duration", Math.max(20, Math.round(shift / 60)) + "s");
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    // Pause and play button
    function setPaused(paused) {
      carousel.classList.toggle("is-paused", paused);
      if (carouselBtn) {
        carouselBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        var label = carouselBtn.querySelector(".toggle-label");
        if (label) label.textContent = paused ? "Play" : "Pause";
      }
    }
    if (carouselBtn) {
      carouselBtn.addEventListener("click", function () {
        setPaused(!carousel.classList.contains("is-paused"));
      });
    }
  }

  /* ---------- Hero photo fallback ---------- */
  var heroImg = document.getElementById("heroImg");
  var heroFrame = heroImg ? heroImg.closest(".photo-frame") : null;
  if (heroImg && heroFrame) {
    var showFallback = function () { heroFrame.classList.add("no-image"); };
    heroImg.addEventListener("error", showFallback);
    if (heroImg.complete && heroImg.naturalWidth === 0) showFallback();
  }

  /* ---------- Voice player ---------- */
  var audio = document.getElementById("audio");
  var playBtn = document.getElementById("playBtn");
  var waveform = document.getElementById("waveform");
  var timeNow = document.getElementById("timeNow");
  var timeTotal = document.getElementById("timeTotal");
  var note = document.getElementById("playerNote");
  var title = document.getElementById("playerTitle");

  if (!audio || !playBtn || !waveform) return;

  // Build a soft, speech-like waveform out of bars.
  var BAR_COUNT = 48;
  var bars = [];
  for (var i = 0; i < BAR_COUNT; i++) {
    var bar = document.createElement("span");
    // Deterministic, natural-looking heights (layered sine waves)
    var h = 28 + 24 * Math.abs(Math.sin(i * 0.55)) + 18 * Math.abs(Math.sin(i * 1.7 + 1)) + 10 * Math.abs(Math.sin(i * 0.23));
    bar.style.setProperty("--h", Math.min(100, Math.round(h)) + "%");
    waveform.appendChild(bar);
    bars.push(bar);
  }

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function paint() {
    var dur = audio.duration;
    var ratio = isFinite(dur) && dur > 0 ? audio.currentTime / dur : 0;
    var filled = Math.round(ratio * BAR_COUNT);
    for (var j = 0; j < BAR_COUNT; j++) {
      bars[j].classList.toggle("played", j < filled);
    }
    timeNow.textContent = fmt(audio.currentTime);
  }

  function setPlaying(isPlaying) {
    playBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    playBtn.setAttribute("aria-label", isPlaying ? "Pause voice sample" : "Play voice sample");
  }

  function showDuration() {
    if (isFinite(audio.duration) && audio.duration > 0) timeTotal.textContent = fmt(audio.duration);
  }
  audio.addEventListener("loadedmetadata", showDuration);
  audio.addEventListener("durationchange", showDuration);
  // Metadata can already be loaded before this script runs (cached or fast connections).
  showDuration();
  audio.addEventListener("timeupdate", paint);
  audio.addEventListener("play", function () { setPlaying(true); });
  audio.addEventListener("pause", function () { setPlaying(false); });
  audio.addEventListener("ended", function () {
    setPlaying(false);
    audio.currentTime = 0;
    paint();
  });

  // If the audio file isn't there yet, say so plainly instead of failing silently.
  function markAudioMissing() {
    if (note) note.hidden = false;
    if (title) title.textContent = "Voice sample";
    playBtn.disabled = true;
    playBtn.style.opacity = "0.5";
    playBtn.style.cursor = "not-allowed";
  }
  audio.addEventListener("error", markAudioMissing);

  // The error can fire before this script runs, so also check the current state
  // and confirm with a quick request for the file.
  if (audio.error) {
    markAudioMissing();
  } else {
    fetch(audio.getAttribute("src"), { method: "HEAD" })
      .then(function (res) { if (!res.ok) markAudioMissing(); })
      .catch(function () { markAudioMissing(); });
  }

  playBtn.addEventListener("click", function () {
    if (audio.paused) {
      // Pause any videos playing in the reel so voices don't overlap.
      document.querySelectorAll(".reel video").forEach(function (v) { v.pause(); });
      var p = audio.play();
      if (p && typeof p.catch === "function") p.catch(function () { setPlaying(false); });
    } else {
      audio.pause();
    }
  });

  // Click or tap the waveform to seek.
  waveform.addEventListener("click", function (e) {
    if (!isFinite(audio.duration)) return;
    var rect = waveform.getBoundingClientRect();
    var ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    paint();
  });

  // When a reel video starts, pause the hero audio.
  document.querySelectorAll(".reel video").forEach(function (v) {
    v.addEventListener("play", function () { if (!audio.paused) audio.pause(); });
  });
})();
