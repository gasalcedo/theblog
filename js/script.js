(function () {
  function initOneCarousel(root) {
    var track = root.querySelector("[data-carousel-track]");
    var live = root.querySelector("[data-carousel-live]");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dots = root.querySelectorAll("[data-carousel-dot]");

    if (!track || !prevBtn || !nextBtn || dots.length === 0) return;

    var slides = track.children.length;
    var index = 0;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var autoplayMs = reduceMotion ? 0 : 6000;
    var timer = null;
    var touchStartX = null;

    function announce() {
      if (live) {
        live.textContent = "Image " + (index + 1) + " of " + slides;
      }
    }

    function syncDots() {
      dots.forEach(function (dot, i) {
        var on = i === index;
        dot.classList.toggle("is-active", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function go(nextIndex) {
      index = ((nextIndex % slides) + slides) % slides;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      syncDots();
      announce();
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (autoplayMs > 0) {
        timer = setInterval(function () {
          go(index + 1);
        }, autoplayMs);
      }
    }

    prevBtn.addEventListener("click", function () {
      go(index - 1);
      stopAutoplay();
      startAutoplay();
    });

    nextBtn.addEventListener("click", function () {
      go(index + 1);
      stopAutoplay();
      startAutoplay();
    });

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var i = parseInt(dot.getAttribute("data-index"), 10);
        if (!isNaN(i)) {
          go(i);
          stopAutoplay();
          startAutoplay();
        }
      });
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
        stopAutoplay();
        startAutoplay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
        stopAutoplay();
        startAutoplay();
      }
    });

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) startAutoplay();
    });

    root.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX == null) return;
        var dx = e.changedTouches[0].screenX - touchStartX;
        touchStartX = null;
        if (dx > 50) {
          go(index - 1);
          stopAutoplay();
          startAutoplay();
        } else if (dx < -50) {
          go(index + 1);
          stopAutoplay();
          startAutoplay();
        }
      },
      { passive: true }
    );

    go(0);
    startAutoplay();
  }

  function initAboutCarousels() {
    document.querySelectorAll("[data-about-carousel]").forEach(initOneCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAboutCarousels);
  } else {
    initAboutCarousels();
  }
})();
