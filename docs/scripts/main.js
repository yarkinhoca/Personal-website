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
    // Coordinates sampled along I-80 from San Francisco to Berkeley (approximate, on actual road)
    // Realistic, curved drive cycle in Istanbul (approximate, with main and side roads)
    // Realistic, winding drive cycle in Istanbul (loop with curves and turns)
    const routeCoords = [
      [41.0082, 28.9784], // Sultanahmet
      [41.0090, 28.9805],
      [41.0098, 28.9820],
      [41.0105, 28.9840],
      [41.0112, 28.9865],
      [41.0120, 28.9880],
      [41.0128, 28.9905],
      [41.0135, 28.9930],
      [41.0142, 28.9955],
      [41.0150, 28.9980],
      [41.0158, 29.0005],
      [41.0165, 29.0030],
      [41.0172, 29.0055],
      [41.0180, 29.0080],
      [41.0188, 29.0105],
      [41.0195, 29.0130],
      [41.0202, 29.0155],
      [41.0210, 29.0180],
      [41.0218, 29.0205],
      [41.0225, 29.0230],
      [41.0232, 29.0255],
      [41.0240, 29.0280],
      [41.0248, 29.0305],
      [41.0255, 29.0330],
      [41.0262, 29.0355],
      [41.0270, 29.0380],
      [41.0278, 29.0405],
      [41.0285, 29.0430],
      [41.0292, 29.0455],
      [41.0300, 29.0480],
      [41.0308, 29.0505],
      [41.0315, 29.0530],
      [41.0322, 29.0555],
      [41.0330, 29.0580],
      [41.0338, 29.0605],
      [41.0345, 29.0630],
      [41.0352, 29.0655],
      [41.0360, 29.0680],
      [41.0368, 29.0705],
      [41.0375, 29.0730],
      [41.0382, 29.0755],
      [41.0390, 29.0780],
      [41.0398, 29.0805],
      [41.0405, 29.0830],
      [41.0412, 29.0855],
      [41.0420, 29.0880],
      [41.0428, 29.0905],
      [41.0435, 29.0930],
      [41.0442, 29.0955],
      [41.0450, 29.0980],
      [41.0458, 29.1005],
      [41.0465, 29.1030],
      [41.0472, 29.1055],
      [41.0480, 29.1080],
      [41.0488, 29.1105],
      [41.0495, 29.1130],
      [41.0502, 29.1155],
      [41.0510, 29.1180],
      [41.0518, 29.1205],
      [41.0525, 29.1230],
      [41.0532, 29.1255],
      [41.0540, 29.1280],
      [41.0548, 29.1305],
      [41.0555, 29.1330],
      [41.0562, 29.1355],
      [41.0570, 29.1380],
      [41.0578, 29.1405],
      [41.0585, 29.1430],
      [41.0592, 29.1455],
      [41.0600, 29.1480],
      [41.0608, 29.1505],
      [41.0615, 29.1530],
      [41.0622, 29.1555],
      [41.0630, 29.1580],
      [41.0638, 29.1605],
      [41.0645, 29.1630],
      [41.0652, 29.1655],
      [41.0660, 29.1680],
      [41.0668, 29.1705],
      [41.0675, 29.1730],
      [41.0682, 29.1755],
      [41.0690, 29.1780],
      [41.0698, 29.1805],
      [41.0705, 29.1830],
      [41.0712, 29.1855],
      [41.0720, 29.1880],
      [41.0728, 29.1905],
      [41.0735, 29.1930],
      [41.0742, 29.1955],
      [41.0750, 29.1980],
      [41.0758, 29.2005],
      [41.0765, 29.2030],
      [41.0772, 29.2055],
      [41.0780, 29.2080],
      [41.0788, 29.2105],
      [41.0795, 29.2130],
      [41.0802, 29.2155],
      [41.0810, 29.2180],
      [41.0818, 29.2205],
      [41.0825, 29.2230],
      [41.0832, 29.2255],
      [41.0840, 29.2280],
      [41.0082, 28.9784] // Loop back to start
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
