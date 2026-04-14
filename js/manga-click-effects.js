(function () {
  var TARGET_SELECTOR =
    "a, button, [role='button'], .post-card, .featured-manga-card, .story-next-link";

  function animateTarget(target) {
    if (!target) return;
    target.classList.remove("click-pop");
    // Force reflow so repeated rapid clicks retrigger animation.
    void target.offsetWidth;
    target.classList.add("click-pop");
    window.setTimeout(function () {
      target.classList.remove("click-pop");
    }, 220);
  }

  function spawnImpactRing(x, y) {
    var ring = document.createElement("span");
    ring.className = "manga-impact-ring";
    ring.style.left = x + "px";
    ring.style.top = y + "px";
    document.body.appendChild(ring);
    ring.addEventListener("animationend", function () {
      ring.remove();
    });
  }

  document.addEventListener("click", function (event) {
    var target = event.target && event.target.closest(TARGET_SELECTOR);
    if (!target) return;

    animateTarget(target);
    spawnImpactRing(event.clientX, event.clientY);
  });
})();
