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

    // Sample CAN data points (20)
    // Realistic 15 km drive cycle on US-101 in San Francisco (approximate)
    // Coordinates sampled along US-101 from SF to SFO
    const routeCoords = [
      [37.7749, -122.4194], [37.7765, -122.4170], [37.7780, -122.4145], [37.7795, -122.4120],
      [37.7810, -122.4095], [37.7825, -122.4070], [37.7840, -122.4045], [37.7855, -122.4020],
      [37.7870, -122.3995], [37.7885, -122.3970], [37.7900, -122.3945], [37.7915, -122.3920],
      [37.7930, -122.3895], [37.7945, -122.3870], [37.7960, -122.3845], [37.7975, -122.3820],
      [37.7990, -122.3795], [37.8005, -122.3770], [37.8020, -122.3745], [37.8035, -122.3720],
      [37.8050, -122.3695], [37.8065, -122.3670], [37.8080, -122.3645], [37.8095, -122.3620],
      [37.8110, -122.3595], [37.8125, -122.3570], [37.8140, -122.3545], [37.8155, -122.3520],
      [37.8170, -122.3495], [37.8185, -122.3470], [37.8200, -122.3445], [37.8215, -122.3420],
      [37.8230, -122.3395], [37.8245, -122.3370], [37.8260, -122.3345], [37.8275, -122.3320],
      [37.8290, -122.3295], [37.8305, -122.3270], [37.8320, -122.3245], [37.8335, -122.3220],
      [37.8350, -122.3195], [37.8365, -122.3170], [37.8380, -122.3145], [37.8395, -122.3120],
      [37.8410, -122.3095], [37.8425, -122.3070], [37.8440, -122.3045], [37.8455, -122.3020],
      [37.8470, -122.2995], [37.8485, -122.2970], [37.8500, -122.2945], [37.8515, -122.2920],
      [37.8530, -122.2895], [37.8545, -122.2870], [37.8560, -122.2845], [37.8575, -122.2820],
      [37.8590, -122.2795], [37.8605, -122.2770], [37.8620, -122.2745], [37.8635, -122.2720],
      [37.8650, -122.2695], [37.8665, -122.2670], [37.8680, -122.2645], [37.8695, -122.2620],
      [37.8710, -122.2595], [37.8725, -122.2570], [37.8740, -122.2545], [37.8755, -122.2520],
      [37.8770, -122.2495]
    ];
    // Generate CAN data for each coordinate
    const canDataPoints = [];
    let timestamp = new Date('2025-08-27T10:00:00Z');
    for (let i = 0; i < routeCoords.length; i++) {
      const [lat, lng] = routeCoords[i];
      timestamp = new Date(timestamp.getTime() + 60 * 1000); // 1 min increments
      canDataPoints.push({
        lat,
        lng,
        timestamp: timestamp.toISOString(),
        speed: 55 + Math.round(Math.sin(i / 8) * 18 + Math.random() * 6),
        steering: Math.round(Math.sin(i / 5) * 8),
        rpm: 2000 + Math.round(Math.sin(i / 10) * 1500 + Math.random() * 120),
        load: 40 + Math.round(Math.cos(i / 7) * 25 + Math.random() * 7),
        fuel: +(7.5 - i * 0.07 + Math.random() * 0.15).toFixed(2),
        coolant: 90 + Math.round(Math.sin(i / 9) * 8 + Math.random() * 2),
        throttle: 20 + Math.round(Math.sin(i / 6) * 18 + Math.random() * 4),
        intakeTemp: 32 + Math.round(Math.sin(i / 12) * 5 + Math.random() * 2),
        oilTemp: 95 + Math.round(Math.sin(i / 13) * 12 + Math.random() * 2),
        maf: +(2.2 + Math.sin(i / 10) * 1.2 + Math.random() * 0.2).toFixed(2),
        baro: 101,
        voltage: +(13.7 + Math.sin(i / 15) * 0.4 + Math.random() * 0.1).toFixed(2),
        gear: Math.min(6, Math.max(1, Math.floor(i / 10) + 1)),
        brake: i % 12 === 0 ? 1 : 0,
        accel: +(0.12 + Math.sin(i / 8) * 0.13 + Math.random() * 0.02).toFixed(2),
        tirePressFL: 32,
        tirePressFR: 32,
        tirePressRL: 30,
        tirePressRR: 30
      });
    }

    // Draw route
    const route = L.polyline(canDataPoints.map(p => [p.lat, p.lng]), { color: '#22d3ee', weight: 3, opacity: 0.9 }).addTo(map);
    map.fitBounds(route.getBounds(), { padding: [12, 12] });

    // Add start/end markers
    const startIcon = L.divIcon({ className: 'start-icon', html: '<div style="width:10px;height:10px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.25)"></div>' });
    const endIcon = L.divIcon({ className: 'end-icon', html: '<div style="width:10px;height:10px;border-radius:999px;background:#38bdf8;box-shadow:0 0 0 4px rgba(56,189,248,.25)"></div>' });
    L.marker([canDataPoints[0].lat, canDataPoints[0].lng], { icon: startIcon }).addTo(map).bindPopup('Ignition on');
    L.marker([canDataPoints[canDataPoints.length - 1].lat, canDataPoints[canDataPoints.length - 1].lng], { icon: endIcon }).addTo(map).bindPopup('Ignition off');

    // Add CAN data markers
    canDataPoints.forEach((point, idx) => {
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 7,
        color: '#38bdf8',
        fillColor: '#22d3ee',
        fillOpacity: 0.85,
        weight: 2
      }).addTo(map);
      let popupHtml = `<strong>Timestamp:</strong> ${point.timestamp}<br />`;
      popupHtml += `<strong>Speed:</strong> ${point.speed} km/h<br />`;
      popupHtml += `<strong>Steering Angle:</strong> ${point.steering}°<br />`;
      popupHtml += `<strong>Engine RPM:</strong> ${point.rpm}<br />`;
      popupHtml += `<strong>Engine Load:</strong> ${point.load}%<br />`;
      popupHtml += `<strong>Instant Fuel Consumption:</strong> ${point.fuel} L/100km<br />`;
      popupHtml += `<strong>Coolant Temp:</strong> ${point.coolant} °C<br />`;
      popupHtml += `<strong>Throttle Position:</strong> ${point.throttle}%<br />`;
      popupHtml += `<strong>Intake Temp:</strong> ${point.intakeTemp} °C<br />`;
      popupHtml += `<strong>Oil Temp:</strong> ${point.oilTemp} °C<br />`;
      popupHtml += `<strong>MAF:</strong> ${point.maf} g/s<br />`;
      popupHtml += `<strong>Barometric Pressure:</strong> ${point.baro} kPa<br />`;
      popupHtml += `<strong>Battery Voltage:</strong> ${point.voltage} V<br />`;
      popupHtml += `<strong>Gear:</strong> ${point.gear}<br />`;
      popupHtml += `<strong>Brake:</strong> ${point.brake}<br />`;
      popupHtml += `<strong>Acceleration:</strong> ${point.accel} g<br />`;
      popupHtml += `<strong>Tire Pressure FL:</strong> ${point.tirePressFL} psi<br />`;
      popupHtml += `<strong>Tire Pressure FR:</strong> ${point.tirePressFR} psi<br />`;
      popupHtml += `<strong>Tire Pressure RL:</strong> ${point.tirePressRL} psi<br />`;
      popupHtml += `<strong>Tire Pressure RR:</strong> ${point.tirePressRR} psi`;
      marker.bindPopup(popupHtml);
    });
  }

  // Wait for Leaflet to load (defer) then init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDriveMap);
  } else {
    initDriveMap();
  }
})();
