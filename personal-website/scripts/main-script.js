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
