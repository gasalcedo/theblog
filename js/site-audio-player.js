(function () {
  if (window.__mfAudioPlayerInit) return;
  window.__mfAudioPlayerInit = true;

  var STORAGE_TIME = "mf_audio_time";
  var STORAGE_PAUSED = "mf_audio_paused";
  var audio = new Audio();
  var scriptSrc = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : new URL("./js/site-audio-player.js", document.baseURI).toString();
  audio.src = new URL("../img/jane-doe.mp3", scriptSrc).toString();
  audio.preload = "metadata";
  audio.loop = false;

  var hasLoadedTime = false;
  var isSeeking = false;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ":" + String(secs).padStart(2, "0");
  }

  function init() {
    var root = document.createElement("div");
    root.className = "site-audio-player";
    root.innerHTML =
      '<button type="button" class="site-audio-player__toggle" aria-label="Play audio">Play</button>' +
      '<div class="site-audio-player__meta">' +
      '  <span class="site-audio-player__label">Now Playing: JANE DOE</span>' +
      '  <input class="site-audio-player__progress" type="range" min="0" max="1000" value="0" step="1" aria-label="Audio progress" />' +
      '  <div class="site-audio-player__times"><span data-current>0:00</span><span data-duration>0:00</span></div>' +
      "</div>";
    document.body.appendChild(root);

    var button = root.querySelector(".site-audio-player__toggle");
    var progress = root.querySelector(".site-audio-player__progress");
    var currentEl = root.querySelector("[data-current]");
    var durationEl = root.querySelector("[data-duration]");

    function syncButton() {
      var playing = !audio.paused;
      button.textContent = playing ? "Pause" : "Play";
      button.setAttribute("aria-label", playing ? "Pause audio" : "Play audio");
    }

    function syncTimeAndProgress() {
      currentEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
      if (!isSeeking && isFinite(audio.duration) && audio.duration > 0) {
        progress.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
      }
    }

    function persistState() {
      localStorage.setItem(STORAGE_TIME, String(audio.currentTime || 0));
      localStorage.setItem(STORAGE_PAUSED, audio.paused ? "true" : "false");
    }

    function update() {
      syncTimeAndProgress();
      persistState();
    }

    button.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    });

    progress.addEventListener("input", function () {
      isSeeking = true;
      if (isFinite(audio.duration) && audio.duration > 0) {
        var t = (Number(progress.value) / 1000) * audio.duration;
        currentEl.textContent = formatTime(t);
      }
    });

    progress.addEventListener("change", function () {
      if (isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
      }
      isSeeking = false;
      persistState();
    });

    audio.addEventListener("loadedmetadata", function () {
      if (!hasLoadedTime) {
        var savedTime = Number(localStorage.getItem(STORAGE_TIME) || "0");
        if (isFinite(savedTime) && savedTime > 0 && savedTime < audio.duration) {
          audio.currentTime = savedTime;
        }
        hasLoadedTime = true;
      }
      syncTimeAndProgress();
    });

    audio.addEventListener("play", syncButton);
    audio.addEventListener("pause", syncButton);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", function () {
      localStorage.setItem(STORAGE_PAUSED, "true");
      syncButton();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) persistState();
    });
    window.addEventListener("beforeunload", persistState);

    syncButton();
    update();

    var savedPaused = localStorage.getItem(STORAGE_PAUSED);
    if (savedPaused === "false") {
      audio.play().catch(function () {
        syncButton();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
