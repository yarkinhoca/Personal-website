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
    // Real Istanbul drive cycle: Sultanahmet > Fatih > Golden Horn > Beyoğlu > Şişli > Beşiktaş > Loop
    const routeCoords = [
      [41.0082, 28.9784], // Sultanahmet
      [41.0095, 28.9750], // Hagia Sophia
      [41.0120, 28.9680], // Fatih
      [41.0170, 28.9630], // Unkapanı
      [41.0210, 28.9600], // Golden Horn Bridge
      [41.0250, 28.9740], // Kasımpaşa
      [41.0300, 28.9850], // Beyoğlu
      [41.0350, 28.9900], // Taksim
      [41.0400, 28.9950], // Şişli
      [41.0450, 29.0000], // Mecidiyeköy
      [41.0480, 29.0100], // Beşiktaş
      [41.0450, 29.0200], // Ortaköy
      [41.0400, 29.0250], // Arnavutköy
      [41.0350, 29.0300], // Bebek
      [41.0300, 29.0350], // Rumelihisarı
      [41.0250, 29.0400], // Emirgan
      [41.0200, 29.0450], // İstinye
      [41.0150, 29.0500], // Tarabya
      [41.0120, 29.0550], // Sarıyer
      [41.0170, 29.0600], // Maslak
      [41.0220, 29.0650], // Ayazağa
      [41.0270, 29.0700], // Hacıosman
      [41.0320, 29.0750], // Bahçeköy
      [41.0370, 29.0800], // Belgrad Forest
      [41.0420, 29.0850], // Kemerburgaz
      [41.0470, 29.0900], // Göktürk
      [41.0520, 29.0950], // Hasdal
      [41.0570, 29.1000], // Kağıthane
      [41.0620, 29.1050], // Alibeyköy
      [41.0670, 29.1100], // Eyüp
      [41.0720, 29.1150], // Sultangazi
      [41.0770, 29.1200], // Gaziosmanpaşa
      [41.0820, 29.1250], // Bayrampaşa
      [41.0840, 29.1280], // Loop back
      [41.0082, 28.9784] // Sultanahmet
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
