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
    const routeCoords = [
      [41.0082, 28.9784], [41.0085, 28.9800], [41.0090, 28.9820], [41.0095, 28.9840],
      [41.0100, 28.9860], [41.0105, 28.9880], [41.0110, 28.9900], [41.0115, 28.9920],
      [41.0120, 28.9940], [41.0125, 28.9960], [41.0130, 28.9980], [41.0135, 29.0000],
      [41.0140, 29.0020], [41.0145, 29.0040], [41.0150, 29.0060], [41.0155, 29.0080],
      [41.0160, 29.0100], [41.0165, 29.0120], [41.0170, 29.0140], [41.0175, 29.0160],
      [41.0180, 29.0180], [41.0185, 29.0200], [41.0190, 29.0220], [41.0195, 29.0240],
      [41.0200, 29.0260], [41.0205, 29.0280], [41.0210, 29.0300], [41.0215, 29.0320],
      [41.0220, 29.0340], [41.0225, 29.0360], [41.0230, 29.0380], [41.0235, 29.0400],
      [41.0240, 29.0420], [41.0245, 29.0440], [41.0250, 29.0460], [41.0255, 29.0480],
      [41.0260, 29.0500], [41.0265, 29.0520], [41.0270, 29.0540], [41.0275, 29.0560],
      [41.0280, 29.0580], [41.0285, 29.0600], [41.0290, 29.0620], [41.0295, 29.0640],
      [41.0300, 29.0660], [41.0305, 29.0680], [41.0310, 29.0700], [41.0315, 29.0720],
      [41.0320, 29.0740], [41.0325, 29.0760], [41.0330, 29.0780], [41.0335, 29.0800],
      [41.0340, 29.0820], [41.0345, 29.0840], [41.0350, 29.0860], [41.0355, 29.0880],
      [41.0360, 29.0900], [41.0365, 29.0920], [41.0370, 29.0940], [41.0375, 29.0960],
      [41.0380, 29.0980], [41.0385, 29.1000], [41.0390, 29.1020], [41.0395, 29.1040],
      [41.0400, 29.1060], [41.0405, 29.1080], [41.0410, 29.1100], [41.0415, 29.1120],
      [41.0420, 29.1140], [41.0425, 29.1160], [41.0430, 29.1180], [41.0435, 29.1200],
      [41.0440, 29.1220], [41.0445, 29.1240], [41.0450, 29.1260], [41.0455, 29.1280],
      [41.0460, 29.1300], [41.0465, 29.1320], [41.0470, 29.1340], [41.0475, 29.1360],
      [41.0480, 29.1380], [41.0485, 29.1400], [41.0490, 29.1420], [41.0495, 29.1440],
      [41.0500, 29.1460], [41.0505, 29.1480], [41.0510, 29.1500], [41.0515, 29.1520],
      [41.0520, 29.1540], [41.0525, 29.1560], [41.0530, 29.1580], [41.0535, 29.1600],
      [41.0540, 29.1620], [41.0545, 29.1640], [41.0550, 29.1660], [41.0555, 29.1680],
      [41.0560, 29.1700], [41.0565, 29.1720], [41.0570, 29.1740], [41.0575, 29.1760],
      [41.0580, 29.1780], [41.0585, 29.1800], [41.0590, 29.1820], [41.0595, 29.1840],
      [41.0600, 29.1860], [41.0605, 29.1880], [41.0610, 29.1900], [41.0615, 29.1920],
      [41.0620, 29.1940], [41.0625, 29.1960], [41.0630, 29.1980], [41.0635, 29.2000]
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
