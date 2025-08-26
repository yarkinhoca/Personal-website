// Minimal interactivity for CanoramIQ site
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Progressive enhancement for the signup form
  const form = document.querySelector('form[data-enhanced]');
  const note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const email = fd.get('email');
      if (!email) return;
      note && (note.textContent = 'Submitting…');
      try {
        // Placeholder: send to your email list provider or serverless endpoint
        // Example fetch('/api/subscribe', { method:'POST', body: JSON.stringify({ email }), headers:{'Content-Type':'application/json'} })
        await new Promise(r => setTimeout(r, 800));
        note && (note.textContent = 'Thanks! We\'ll be in touch.');
        form.reset();
      } catch (err) {
        note && (note.textContent = 'Something went wrong. Please try again.');
      }
    });
  }

  // Initialize Leaflet map inside phone UI with a random drive cycle
  function initDriveMap(){
    const mapEl = document.getElementById('drive-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Base map
    const map = L.map(mapEl, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
    });

    // Use a light, fast OSM tile. For production, consider a styled tileset.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Generate a pseudo-random walk to simulate a drive
    const start = [37.7749, -122.4194]; // SF as a default anchor
    const points = [start];
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      const [lat, lng] = points[points.length - 1];
      const dLat = (Math.random() - 0.5) * 0.0035;
      const dLng = (Math.random() - 0.5) * 0.0045;
      points.push([lat + dLat, lng + dLng]);
    }

    // Draw route
    const route = L.polyline(points, { color: '#22d3ee', weight: 3, opacity: 0.9 }).addTo(map);
    map.fitBounds(route.getBounds(), { padding: [12, 12] });

    // Add start/end markers
    const startIcon = L.divIcon({ className: 'start-icon', html: '<div style="width:10px;height:10px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.25)"></div>' });
    const endIcon = L.divIcon({ className: 'end-icon', html: '<div style="width:10px;height:10px;border-radius:999px;background:#38bdf8;box-shadow:0 0 0 4px rgba(56,189,248,.25)"></div>' });
    L.marker(points[0], { icon: startIcon }).addTo(map).bindPopup('Ignition on');
    L.marker(points[points.length - 1], { icon: endIcon }).addTo(map).bindPopup('Ignition off');

    // Choose a few random outlier indices and mark them
    const outliers = new Set();
    while (outliers.size < 3) {
      const idx = Math.floor(Math.random() * (points.length - 2)) + 1;
      outliers.add(idx);
    }
    outliers.forEach((i) => {
      const p = points[i];
      const icon = L.divIcon({ className: 'outlier-icon', html: '<div style="width:12px;height:12px;border-radius:999px;background:#ef4444;box-shadow:0 0 0 6px rgba(239,68,68,.22)"></div>' });
      L.marker(p, { icon }).addTo(map).bindPopup('Outlier detected\n• Example: Coolant spike');
    });
  }

  // Wait for Leaflet to load (defer) then init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDriveMap);
  } else {
    initDriveMap();
  }
})();
