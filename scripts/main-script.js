// Demo interactions for CanoramIQ static page

// Simple hero slider
(function(){
  const slides = document.querySelectorAll('.slide');
  let idx = 0;
  function show(i){
    slides.forEach(s=>s.classList.remove('active'));
    slides[i].classList.add('active');
  }
  if (slides.length) show(idx);
  setInterval(()=>{ if (slides.length){ idx = (idx+1)%slides.length; show(idx);} }, 5000);
})();

// Set current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Initialize Leaflet map with sample CAN markers
(function(){
  if (typeof L === 'undefined') return; // Leaflet not loaded
  const map = L.map('map').setView([37.773972, -122.431297], 12); // San Francisco as demo
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    attribution:'© OpenStreetMap contributors'
  }).addTo(map);
  // make a live polyline for the drive route and expose map objects for other scopes
  const route = L.polyline(points.map(p=>[p.lat,p.lng]), {color:'#007acc'}).addTo(map);
  window.canoram = window.canoram || {};
  window.canoram.map = map;
  window.canoram.route = route;

  // Simulated CAN data points
  const points = [
    {lat:37.7749, lng:-122.4194, data:{speed:48, rpm:2300, coolant:88}},
    {lat:37.7849, lng:-122.4094, data:{speed:62, rpm:2800, coolant:90}},
    {lat:37.7649, lng:-122.4294, data:{speed:35, rpm:1800, coolant:85}}
  ];

  const detailsEl = document.getElementById('pointDetails');

  points.forEach((p,i)=>{
    const m = L.marker([p.lat, p.lng]).addTo(map);
    m.on('click', ()=>{
      if (detailsEl) detailsEl.innerHTML = `<strong>Point ${i+1}</strong><br>Speed: ${p.data.speed} km/h<br>RPM: ${p.data.rpm}<br>Coolant: ${p.data.coolant} °C`;
    });
    m.bindPopup(`<strong>Point ${i+1}</strong><br>Speed: ${p.data.speed} km/h`);
  });

  // End drive button simulates scoring and uploads
  const endBtn = document.getElementById('endDriveBtn');
  if (endBtn){
    endBtn.addEventListener('click', ()=>{
      // Simulated scoring
      const engine = Math.round(60 + Math.random()*40);
      const driver = Math.round(50 + Math.random()*50);
      const fuel = Math.round(55 + Math.random()*45);

      const engineEl = document.getElementById('engineScore');
      const driverEl = document.getElementById('driverScore');
      const fuelEl = document.getElementById('fuelScore');

      if (engineEl) engineEl.textContent = engine + '/100';
      if (driverEl) driverEl.textContent = driver + '/100';
      if (fuelEl) fuelEl.textContent = fuel + '/100';

      alert('Drive ended. Scores generated and uploaded to cloud (simulated).');
    });
  }
})();

// Simulated Bluetooth connect and live CAN updates
(function(){
  const connectBtn = document.getElementById('connectBtn');
  const btStatus = document.getElementById('btStatus');
  const deviceName = document.getElementById('deviceName');

  let connected = false;
  let intervalId = null;

  function startSim(){
    // initialize simulation anchors
    window.canoram._sim = window.canoram._sim || {};
    const sim = window.canoram._sim;
    if (!sim.lat) { sim.lat = 37.773972; sim.lng = -122.431297; }
    if (!sim.initialFuel) { sim.initialFuel = 65 + Math.round(Math.random()*30); }
    if (!window.canoram.session) window.canoram.session = [];

    intervalId = setInterval(()=>{
      // small GPS drift to simulate movement
      sim.lat += (Math.random() - 0.5) * 0.0018;
      sim.lng += (Math.random() - 0.5) * 0.0018;

      // realistic CAN values with relationships
      const baseSpeed = 20 + Math.abs(Math.sin(Date.now()/60000) * 60);
      const noise = (Math.random() - 0.5) * 8;
      const speed = Math.max(0, Math.round(baseSpeed + noise));
      const rpm = Math.max(600, Math.round(800 + speed * 28 + (Math.random() - 0.5) * 300));
      const coolant = Math.round(75 + Math.random() * 18);

      // fuel drains slowly over samples
      const usedSoFar = window.canoram.session.length * (0.02 + Math.random() * 0.06);
      const fuel = Math.max(1, Math.round(sim.initialFuel - usedSoFar));

      const throttle = Math.round(Math.min(100, Math.max(0, (speed / 120) * 100 + (Math.random()-0.5)*20)));

      // record sample
      const sample = {
        ts: Date.now(), lat: sim.lat, lng: sim.lng,
        speed, rpm, coolant, fuel, throttle
      };
      window.canoram.session.push(sample);

      // update UI readouts
      const s = document.getElementById('canSpeed'); if (s) s.textContent = speed + ' km/h';
      const r = document.getElementById('canRpm'); if (r) r.textContent = rpm;
      const c = document.getElementById('canCoolant'); if (c) c.textContent = coolant + ' °C';
      const f = document.getElementById('canFuel'); if (f) f.textContent = fuel + ' %';

      // add a small map marker and extend the route polyline
      if (window.canoram.map && window.canoram.route){
        const latlng = [sim.lat, sim.lng];
        // add a subtle marker every 3 samples
        if (window.canoram.session.length % 3 === 0){
          const mk = L.circleMarker(latlng, {radius:4, color:'#0b2545', fillOpacity:0.9}).addTo(window.canoram.map);
          mk.bindPopup(`Speed: ${speed} km/h<br>RPM: ${rpm}`).on('click', ()=> mk.openPopup());
        }
        window.canoram.route.addLatLng(latlng);
        // pan map slowly to follow
        if (window.canoram.session.length % 4 === 0) window.canoram.map.panTo(latlng);
      }
    }, 1500);
  }

  function stopSim(){ if (intervalId) clearInterval(intervalId); intervalId = null; }

  if (connectBtn){
    connectBtn.addEventListener('click', ()=>{
      if (!connected){
        connected = true; btStatus.textContent = 'Connected'; deviceName.textContent = 'ELM327-AB:12:34';
        connectBtn.textContent = 'Disconnect'; connectBtn.classList.remove('outline');
        startSim();
      } else {
        connected = false; btStatus.textContent = 'Disconnected'; deviceName.textContent = 'No device';
        connectBtn.textContent = 'Connect ELM327'; connectBtn.classList.add('outline');
        stopSim();
        // clear values
        ['canSpeed','canRpm','canCoolant','canFuel'].forEach(id=>{ const e=document.getElementById(id); if (e) e.textContent='—'; });
      }
    });
  }
})();
