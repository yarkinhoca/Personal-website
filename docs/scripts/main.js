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
    const canDataPoints = [
      {
        lat: 37.7749, lng: -122.4194, timestamp: '2025-08-27T10:00:00Z', speed: 42, steering: 2, rpm: 1800, load: 35, fuel: 7.2, coolant: 88, throttle: 18, intakeTemp: 32, oilTemp: 95, maf: 2.1, baro: 101, voltage: 13.8, gear: 3, brake: 0, accel: 0.12, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7751, lng: -122.4192, timestamp: '2025-08-27T10:01:00Z', speed: 45, steering: 3, rpm: 1900, load: 38, fuel: 7.0, coolant: 89, throttle: 20, intakeTemp: 33, oilTemp: 96, maf: 2.2, baro: 101, voltage: 13.7, gear: 3, brake: 0, accel: 0.13, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7753, lng: -122.4190, timestamp: '2025-08-27T10:02:00Z', speed: 48, steering: 1, rpm: 2000, load: 40, fuel: 6.8, coolant: 90, throttle: 22, intakeTemp: 34, oilTemp: 97, maf: 2.3, baro: 101, voltage: 13.7, gear: 4, brake: 0, accel: 0.14, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7755, lng: -122.4188, timestamp: '2025-08-27T10:03:00Z', speed: 50, steering: 0, rpm: 2100, load: 42, fuel: 6.6, coolant: 91, throttle: 24, intakeTemp: 35, oilTemp: 98, maf: 2.4, baro: 101, voltage: 13.6, gear: 4, brake: 0, accel: 0.15, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7757, lng: -122.4186, timestamp: '2025-08-27T10:04:00Z', speed: 52, steering: -1, rpm: 2200, load: 44, fuel: 6.4, coolant: 92, throttle: 26, intakeTemp: 36, oilTemp: 99, maf: 2.5, baro: 101, voltage: 13.6, gear: 4, brake: 0, accel: 0.16, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7759, lng: -122.4184, timestamp: '2025-08-27T10:05:00Z', speed: 54, steering: -2, rpm: 2300, load: 46, fuel: 6.2, coolant: 93, throttle: 28, intakeTemp: 37, oilTemp: 100, maf: 2.6, baro: 101, voltage: 13.5, gear: 5, brake: 0, accel: 0.17, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7761, lng: -122.4182, timestamp: '2025-08-27T10:06:00Z', speed: 56, steering: -3, rpm: 2400, load: 48, fuel: 6.0, coolant: 94, throttle: 30, intakeTemp: 38, oilTemp: 101, maf: 2.7, baro: 101, voltage: 13.5, gear: 5, brake: 0, accel: 0.18, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7763, lng: -122.4180, timestamp: '2025-08-27T10:07:00Z', speed: 58, steering: -4, rpm: 2500, load: 50, fuel: 5.8, coolant: 95, throttle: 32, intakeTemp: 39, oilTemp: 102, maf: 2.8, baro: 101, voltage: 13.4, gear: 5, brake: 0, accel: 0.19, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7765, lng: -122.4178, timestamp: '2025-08-27T10:08:00Z', speed: 60, steering: -5, rpm: 2600, load: 52, fuel: 5.6, coolant: 96, throttle: 34, intakeTemp: 40, oilTemp: 103, maf: 2.9, baro: 101, voltage: 13.4, gear: 6, brake: 0, accel: 0.20, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7767, lng: -122.4176, timestamp: '2025-08-27T10:09:00Z', speed: 62, steering: -6, rpm: 2700, load: 54, fuel: 5.4, coolant: 97, throttle: 36, intakeTemp: 41, oilTemp: 104, maf: 3.0, baro: 101, voltage: 13.3, gear: 6, brake: 0, accel: 0.21, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7769, lng: -122.4174, timestamp: '2025-08-27T10:10:00Z', speed: 64, steering: -7, rpm: 2800, load: 56, fuel: 5.2, coolant: 98, throttle: 38, intakeTemp: 42, oilTemp: 105, maf: 3.1, baro: 101, voltage: 13.3, gear: 6, brake: 0, accel: 0.22, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7771, lng: -122.4172, timestamp: '2025-08-27T10:11:00Z', speed: 66, steering: -8, rpm: 2900, load: 58, fuel: 5.0, coolant: 99, throttle: 40, intakeTemp: 43, oilTemp: 106, maf: 3.2, baro: 101, voltage: 13.2, gear: 6, brake: 0, accel: 0.23, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7773, lng: -122.4170, timestamp: '2025-08-27T10:12:00Z', speed: 68, steering: -9, rpm: 3000, load: 60, fuel: 4.8, coolant: 100, throttle: 42, intakeTemp: 44, oilTemp: 107, maf: 3.3, baro: 101, voltage: 13.2, gear: 6, brake: 0, accel: 0.24, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7775, lng: -122.4168, timestamp: '2025-08-27T10:13:00Z', speed: 70, steering: -10, rpm: 3100, load: 62, fuel: 4.6, coolant: 101, throttle: 44, intakeTemp: 45, oilTemp: 108, maf: 3.4, baro: 101, voltage: 13.1, gear: 6, brake: 0, accel: 0.25, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7777, lng: -122.4166, timestamp: '2025-08-27T10:14:00Z', speed: 72, steering: -11, rpm: 3200, load: 64, fuel: 4.4, coolant: 102, throttle: 46, intakeTemp: 46, oilTemp: 109, maf: 3.5, baro: 101, voltage: 13.1, gear: 6, brake: 0, accel: 0.26, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7779, lng: -122.4164, timestamp: '2025-08-27T10:15:00Z', speed: 74, steering: -12, rpm: 3300, load: 66, fuel: 4.2, coolant: 103, throttle: 48, intakeTemp: 47, oilTemp: 110, maf: 3.6, baro: 101, voltage: 13.0, gear: 6, brake: 0, accel: 0.27, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7781, lng: -122.4162, timestamp: '2025-08-27T10:16:00Z', speed: 76, steering: -13, rpm: 3400, load: 68, fuel: 4.0, coolant: 104, throttle: 50, intakeTemp: 48, oilTemp: 111, maf: 3.7, baro: 101, voltage: 13.0, gear: 6, brake: 0, accel: 0.28, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7783, lng: -122.4160, timestamp: '2025-08-27T10:17:00Z', speed: 78, steering: -14, rpm: 3500, load: 70, fuel: 3.8, coolant: 105, throttle: 52, intakeTemp: 49, oilTemp: 112, maf: 3.8, baro: 101, voltage: 12.9, gear: 6, brake: 0, accel: 0.29, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      },
      {
        lat: 37.7785, lng: -122.4158, timestamp: '2025-08-27T10:18:00Z', speed: 80, steering: -15, rpm: 3600, load: 72, fuel: 3.6, coolant: 106, throttle: 54, intakeTemp: 50, oilTemp: 113, maf: 3.9, baro: 101, voltage: 12.9, gear: 6, brake: 0, accel: 0.30, tirePressFL: 32, tirePressFR: 32, tirePressRL: 30, tirePressRR: 30
      }
    ];

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
