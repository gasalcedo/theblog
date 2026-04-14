(function () {
  function initMap(el) {
    if (typeof L === "undefined") return;
    var lat = parseFloat(el.dataset.lat, 10);
    var lng = parseFloat(el.dataset.lng, 10);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    var zoom = parseInt(el.dataset.zoom || "16", 10);
    var map = L.map(el, {
      scrollWheelZoom: false,
      attributionControl: false,
      zoomControl: true,
    }).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);
  }

  function boot() {
    document.querySelectorAll("[data-store-map]").forEach(initMap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
