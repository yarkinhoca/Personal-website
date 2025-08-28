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
    const routeCoords = [
      [37.7749, -122.4194], [37.7762, -122.4180], [37.7775, -122.4165], [37.7788, -122.4150],
      [37.7801, -122.4135], [37.7814, -122.4120], [37.7827, -122.4105], [37.7840, -122.4090],
      [37.7853, -122.4075], [37.7866, -122.4060], [37.7879, -122.4045], [37.7892, -122.4030],
      [37.7905, -122.4015], [37.7918, -122.4000], [37.7931, -122.3985], [37.7944, -122.3970],
      [37.7957, -122.3955], [37.7970, -122.3940], [37.7983, -122.3925], [37.7996, -122.3910],
      [37.8009, -122.3895], [37.8022, -122.3880], [37.8035, -122.3865], [37.8048, -122.3850],
      [37.8061, -122.3835], [37.8074, -122.3820], [37.8087, -122.3805], [37.8100, -122.3790],
      [37.8113, -122.3775], [37.8126, -122.3760], [37.8139, -122.3745], [37.8152, -122.3730],
      [37.8165, -122.3715], [37.8178, -122.3700], [37.8191, -122.3685], [37.8204, -122.3670],
      [37.8217, -122.3655], [37.8230, -122.3640], [37.8243, -122.3625], [37.8256, -122.3610],
      [37.8269, -122.3595], [37.8282, -122.3580], [37.8295, -122.3565], [37.8308, -122.3550],
      [37.8321, -122.3535], [37.8334, -122.3520], [37.8347, -122.3505], [37.8360, -122.3490],
      [37.8373, -122.3475], [37.8386, -122.3460], [37.8399, -122.3445], [37.8412, -122.3430],
      [37.8425, -122.3415], [37.8438, -122.3400], [37.8451, -122.3385], [37.8464, -122.3370],
      [37.8477, -122.3355], [37.8490, -122.3340], [37.8503, -122.3325], [37.8516, -122.3310],
      [37.8529, -122.3295], [37.8542, -122.3280], [37.8555, -122.3265], [37.8568, -122.3250],
      [37.8581, -122.3235], [37.8594, -122.3220], [37.8607, -122.3205], [37.8620, -122.3190],
      [37.8633, -122.3175], [37.8646, -122.3160], [37.8659, -122.3145], [37.8672, -122.3130],
      [37.8685, -122.3115], [37.8698, -122.3100], [37.8711, -122.3085], [37.8724, -122.3070],
      [37.8737, -122.3055], [37.8750, -122.3040], [37.8763, -122.3025], [37.8776, -122.3010],
      [37.8789, -122.2995], [37.8802, -122.2980], [37.8815, -122.2965], [37.8828, -122.2950],
      [37.8841, -122.2935], [37.8854, -122.2920], [37.8867, -122.2905], [37.8880, -122.2890],
      [37.8893, -122.2875], [37.8906, -122.2860], [37.8919, -122.2845], [37.8932, -122.2830],
      [37.8945, -122.2815], [37.8958, -122.2800], [37.8971, -122.2785], [37.8984, -122.2770],
      [37.8997, -122.2755], [37.9010, -122.2740], [37.9023, -122.2725], [37.9036, -122.2710],
      [37.9049, -122.2695], [37.9062, -122.2680], [37.9075, -122.2665], [37.9088, -122.2650],
      [37.9101, -122.2635], [37.9114, -122.2620], [37.9127, -122.2605], [37.9140, -122.2590],
      [37.9153, -122.2575], [37.9166, -122.2560], [37.9179, -122.2545], [37.9192, -122.2530],
      [37.9205, -122.2515], [37.9218, -122.2500], [37.9231, -122.2485], [37.9244, -122.2470],
      [37.9257, -122.2455], [37.9270, -122.2440], [37.9283, -122.2425], [37.9296, -122.2410],
      [37.9309, -122.2395], [37.9322, -122.2380], [37.9335, -122.2365], [37.9348, -122.2350],
      [37.9361, -122.2335], [37.9374, -122.2320], [37.9387, -122.2305], [37.9400, -122.2290],
      [37.9413, -122.2275], [37.9426, -122.2260], [37.9439, -122.2245], [37.9452, -122.2230],
      [37.9465, -122.2215], [37.9478, -122.2200], [37.9491, -122.2185], [37.9504, -122.2170],
      [37.9517, -122.2155], [37.9530, -122.2140], [37.9543, -122.2125], [37.9556, -122.2110],
      [37.9569, -122.2095], [37.9582, -122.2080], [37.9595, -122.2065], [37.9608, -122.2050],
      [37.9621, -122.2035], [37.9634, -122.2020], [37.9647, -122.2005], [37.9660, -122.1990],
      [37.9673, -122.1975], [37.9686, -122.1960], [37.9699, -122.1945], [37.9712, -122.1930],
      [37.9725, -122.1915], [37.9738, -122.1900], [37.9751, -122.1885], [37.9764, -122.1870],
      [37.9777, -122.1855], [37.9790, -122.1840], [37.9803, -122.1825], [37.9816, -122.1810],
      [37.9829, -122.1795], [37.9842, -122.1780], [37.9855, -122.1765], [37.9868, -122.1750],
      [37.9881, -122.1735], [37.9894, -122.1720], [37.9907, -122.1705], [37.9920, -122.1690],
      [37.9933, -122.1675], [37.9946, -122.1660], [37.9959, -122.1645], [37.9972, -122.1630],
      [37.9985, -122.1615], [37.9998, -122.1600], [38.0011, -122.1585], [38.0024, -122.1570],
      [38.0037, -122.1555], [38.0050, -122.1540], [38.0063, -122.1525], [38.0076, -122.1510],
      [38.0089, -122.1495], [38.0102, -122.1480], [38.0115, -122.1465], [38.0128, -122.1450],
      [38.0141, -122.1435], [38.0154, -122.1420], [38.0167, -122.1405], [38.0180, -122.1390],
      [38.0193, -122.1375], [38.0206, -122.1360], [38.0219, -122.1345], [38.0232, -122.1330],
      [38.0245, -122.1315], [38.0258, -122.1300], [38.0271, -122.1285], [38.0284, -122.1270],
      [38.0297, -122.1255], [38.0310, -122.1240], [38.0323, -122.1225], [38.0336, -122.1210],
      [38.0349, -122.1195], [38.0362, -122.1180], [38.0375, -122.1165], [38.0388, -122.1150],
      [38.0401, -122.1135], [38.0414, -122.1120], [38.0427, -122.1105], [38.0440, -122.1090],
      [38.0453, -122.1075], [38.0466, -122.1060], [38.0479, -122.1045], [38.0492, -122.1030],
      [38.0505, -122.1015], [38.0518, -122.1000], [38.0531, -122.0985], [38.0544, -122.0970],
      [38.0557, -122.0955], [38.0570, -122.0940], [38.0583, -122.0925], [38.0596, -122.0910],
      [38.0609, -122.0895], [38.0622, -122.0880], [38.0635, -122.0865], [38.0648, -122.0850],
      [38.0661, -122.0835], [38.0674, -122.0820], [38.0687, -122.0805], [38.0700, -122.0790],
      [38.0713, -122.0775], [38.0726, -122.0760], [38.0739, -122.0745], [38.0752, -122.0730],
      [38.0765, -122.0715], [38.0778, -122.0700], [38.0791, -122.0685], [38.0804, -122.0670],
      [38.0817, -122.0655], [38.0830, -122.0640], [38.0843, -122.0625], [38.0856, -122.0610],
      [38.0869, -122.0595], [38.0882, -122.0580], [38.0895, -122.0565], [38.0908, -122.0550],
      [38.0921, -122.0535], [38.0934, -122.0520], [38.0947, -122.0505], [38.0960, -122.0490],
      [38.0973, -122.0475], [38.0986, -122.0460], [38.0999, -122.0445], [38.1012, -122.0430],
      [38.1025, -122.0415], [38.1038, -122.0400], [38.1051, -122.0385], [38.1064, -122.0370],
      [38.1077, -122.0355], [38.1090, -122.0340], [38.1103, -122.0325], [38.1116, -122.0310],
      [38.1129, -122.0295], [38.1142, -122.0280], [38.1155, -122.0265], [38.1168, -122.0250],
      [38.1181, -122.0235], [38.1194, -122.0220], [38.1207, -122.0205], [38.1220, -122.0190],
      [38.1233, -122.0175], [38.1246, -122.0160], [38.1259, -122.0145], [38.1272, -122.0130],
      [38.1285, -122.0115], [38.1298, -122.0100], [38.1311, -122.0085], [38.1324, -122.0070],
      [38.1337, -122.0055], [38.1350, -122.0040], [38.1363, -122.0025], [38.1376, -122.0010],
      [38.1389, -121.9995], [38.1402, -121.9980], [38.1415, -121.9965], [38.1428, -121.9950],
      [38.1441, -121.9935], [38.1454, -121.9920], [38.1467, -121.9905], [38.1480, -121.9890],
      [38.1493, -121.9875], [38.1506, -121.9860], [38.1519, -121.9845], [38.1532, -121.9830],
      [38.1545, -121.9815], [38.1558, -121.9800], [38.1571, -121.9785], [38.1584, -121.9770],
      [38.1597, -121.9755], [38.1610, -121.9740], [38.1623, -121.9725], [38.1636, -121.9710],
      [38.1649, -121.9695], [38.1662, -121.9680], [38.1675, -121.9665], [38.1688, -121.9650],
      [38.1701, -121.9635], [38.1714, -121.9620], [38.1727, -121.9605], [38.1740, -121.9590],
      [38.1753, -121.9575], [38.1766, -121.9560], [38.1779, -121.9545], [38.1792, -121.9530],
      [38.1805, -121.9515], [38.1818, -121.9500], [38.1831, -121.9485], [38.1844, -121.9470],
      [38.1857, -121.9455], [38.1870, -121.9440], [38.1883, -121.9425], [38.1896, -121.9410],
      [38.1909, -121.9395], [38.1922, -121.9380], [38.1935, -121.9365], [38.1948, -121.9350],
      [38.1961, -121.9335], [38.1974, -121.9320], [38.1987, -121.9305], [38.2000, -121.9290]
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
