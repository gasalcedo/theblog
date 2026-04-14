(function () {
  function initFeaturedMangaModal() {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("[data-featured-manga]")
    );

    if (!cards.length) return;

    var modal = document.createElement("div");
    modal.className = "featured-manga-modal";
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="featured-manga-modal__backdrop" data-modal-close></div>' +
      '<div class="featured-manga-modal__dialog" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="featured-manga-modal-title">' +
      '  <button type="button" class="featured-manga-modal__close" data-modal-close aria-label="Close popup">×</button>' +
      '  <img class="featured-manga-modal__image" src="" alt="" />' +
      '  <h3 id="featured-manga-modal-title" class="featured-manga-modal__title"></h3>' +
      '  <p class="featured-manga-modal__price"></p>' +
      '  <p class="featured-manga-modal__note"></p>' +
      "</div>";

    document.body.appendChild(modal);

    var dialog = modal.querySelector(".featured-manga-modal__dialog");
    var image = modal.querySelector(".featured-manga-modal__image");
    var title = modal.querySelector(".featured-manga-modal__title");
    var price = modal.querySelector(".featured-manga-modal__price");
    var note = modal.querySelector(".featured-manga-modal__note");
    var activeCard = null;

    function openModal(card) {
      activeCard = card;
      image.src = card.getAttribute("data-panel-src") || "";
      image.alt = card.getAttribute("data-panel-alt") || "";
      title.textContent = card.getAttribute("data-panel-title") || "Featured manga";
      price.textContent = card.getAttribute("data-panel-price") || "Price varies by edition";
      note.textContent = card.getAttribute("data-panel-note") || "";

      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      dialog.focus();
    }

    function closeModal() {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (activeCard) activeCard.focus();
    }

    cards.forEach(function (card) {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.classList.add("featured-manga-card--clickable");

      card.addEventListener("click", function () {
        openModal(card);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(card);
        }
      });
    });

    modal.addEventListener("click", function (event) {
      if (event.target && event.target.hasAttribute("data-modal-close")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFeaturedMangaModal);
  } else {
    initFeaturedMangaModal();
  }
})();
