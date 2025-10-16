
// Slide-in animation on scroll
  function initSlideInAnimations() {
    const slideEls = document.querySelectorAll('.slide-in');
    function onScroll() {
      slideEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  }
// Minimal interactivity for CanoramIQ site
(function(){
  // Phone scroll handling: scroll inside phone when possible; let page scroll at edges
  function initPhoneScrollHijack(){
    const section = document.getElementById('phone-scroll-section');
    const container = section ? section.querySelector('.phone-scroll-container') : null;
  const pager = section ? section.querySelector('.phone-pager') : null;
  const dots = pager ? Array.from(pager.querySelectorAll('.pager-dot')) : [];
    if (!section || !container) return;
    const panels = Array.from(container.querySelectorAll('.screen-panel'));
    const lastIndex = Math.max(0, panels.length - 1);
    const EPS = 2; // px tolerance for floating rounding
    function atEnd(){
      return container.scrollTop >= container.scrollHeight - container.clientHeight - EPS;
    }
    function atStart(){
      return container.scrollTop <= EPS;
    }

    // Jump-per-gesture navigation
    let animating = false;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function goTo(index){
      const h = container.clientHeight;
      const targetIdx = Math.max(0, Math.min(lastIndex, index));
      if (animating) return;
      animating = true;
      container.scrollTo({ top: targetIdx * h, behavior: prefersReduced ? 'auto' : 'smooth' });
      // Fallback cooldown; scrollend not fully supported everywhere
      const duration = prefersReduced ? 80 : 420;
      setTimeout(()=>{ animating = false; }, duration);
    }

    // Wheel: one panel per gesture
    container.addEventListener('wheel', (e)=>{
      const dy = e.deltaY;
      if (dy === 0) return;
      const h = container.clientHeight;
      const idx = Math.round(container.scrollTop / h);
      const goingDown = dy > 0;
      if (goingDown && idx < lastIndex){
        e.preventDefault();
        goTo(idx + 1);
      } else if (!goingDown && idx > 0){
        e.preventDefault();
        goTo(idx - 1);
      } // else: let page scroll
    }, { passive:false });

    // Touch swipe: decide on touchend based on total delta
    let touchStartY = 0;
    let touchDy = 0;
    container.addEventListener('touchstart', (e)=>{ touchStartY = e.touches[0].clientY; touchDy = 0; }, { passive:true });
    container.addEventListener('touchmove', (e)=>{
      const y = e.touches[0].clientY;
      touchDy = touchStartY - y; // positive = swipe up
      if (Math.abs(touchDy) > 20) e.preventDefault(); // suppress accidental scroll
    }, { passive:false });
    container.addEventListener('touchend', ()=>{
      const h = container.clientHeight;
      const idx = Math.round(container.scrollTop / h);
      const threshold = 40; // px
      if (Math.abs(touchDy) < threshold) return; // ignore small swipes
      if (touchDy > 0 && idx < lastIndex){
        goTo(idx + 1);
      } else if (touchDy < 0 && idx > 0){
        goTo(idx - 1);
      }
      touchDy = 0;
    }, { passive:true });

    // Pager sync only (no auto-snap)
    function syncPager(){
      if (!dots.length) return;
      const idx = Math.round(container.scrollTop / container.clientHeight);
      dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
    }
    container.addEventListener('scroll', ()=>{
      syncPager();
    }, { passive:true });
    dots.forEach((dot)=>{
      dot.addEventListener('click', ()=>{
        const idx = Number(dot.dataset.index||0);
        const h = container.clientHeight;
        const clamped = Math.max(0, Math.min(lastIndex, idx));
        goTo(clamped);
      });
    });

    // (single wheel handler above covers edge jumping)
  }
  initPhoneScrollHijack();
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
  [41.0457, 29.0220], // Ortaköy (Bosphorus Bridge entrance)
  [41.0459, 29.0272], // Bosphorus Bridge midpoint (15 July Martyrs Bridge)
  [41.0456, 29.0330], // Asian side exit (Üsküdar)
  [41.0400, 29.0400], // Acıbadem
  [41.0350, 29.0450], // Kadıköy
  [41.0300, 29.0500], // Göztepe
  [41.0250, 29.0550], // Bostancı
  [41.0200, 29.0600], // Ataşehir
  [41.0150, 29.0650], // Kozyatağı
  [41.0120, 29.0700], // Maltepe
  [41.0170, 29.0750], // Kartal
  [41.0220, 29.0800], // Pendik
  [41.0270, 29.0850], // Tuzla
  [41.0320, 29.0900], // Sabiha Gökçen
  [41.0370, 29.0950], // Kurtköy
  [41.0420, 29.1000], // Sultanbeyli
  [41.0470, 29.1050], // Çekmeköy
  [41.0520, 29.1100], // Ümraniye
  [41.0570, 29.1150], // Ataşehir
  [41.0620, 29.1200], // Üsküdar
  [41.0670, 29.1250], // Loop back
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
      // Minimal, elegant popup content
      const time = new Date(point.timestamp);
      const hh = String(time.getHours()).padStart(2,'0');
      const mm = String(time.getMinutes()).padStart(2,'0');
      const popupHtml = `
        <div class="can-popup-head">Segment <span class="time">${hh}:${mm}</span></div>
        <ul class="can-list">
          <li><span>Speed</span><strong>${point.speed} km/h</strong></li>
          <li><span>RPM</span><strong>${point.rpm}</strong></li>
          <li><span>Fuel</span><strong>${point.fuel} L/100km</strong></li>
          <li><span>Coolant</span><strong>${point.coolant} °C</strong></li>
          <li><span>Voltage</span><strong>${point.voltage} V</strong></li>
        </ul>`;
      marker.bindPopup(popupHtml, { className: 'can-popup', maxWidth: 220, closeButton: true, autoClose: true, autoPan: true, autoPanPadding: [8,8] });
    });

    // Stream some demo updates into the phone KPIs and health gauge
    const fuelEl = document.getElementById('phone-kpi-fuel');
    const coolantEl = document.getElementById('phone-kpi-coolant');
    const scoreEl = document.getElementById('phone-kpi-score');
    const voltEl = document.getElementById('phone-kpi-voltage');
    const voltStatusEl = document.getElementById('phone-kpi-voltage-status');
    const injEl = document.getElementById('phone-kpi-injection');
    const dpfEl = document.getElementById('phone-kpi-dpf');
    const hg = document.getElementById('hg-fg');
    const hgText = document.getElementById('hg-text');

    // Industry selector
    let industry = 'car';
    const selector = document.querySelector('.industry-selector');
    if (selector){
      selector.querySelectorAll('.seg-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          selector.querySelectorAll('.seg-btn').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed','true');
          industry = btn.dataset.industry || 'car';
        });
      });
    }

    function setHealth(val){
      if (!hg || !hgText) return;
      const circumference = 2 * Math.PI * 52; // r=52
      const pct = Math.max(0, Math.min(100, val));
      const dash = circumference * (1 - pct/100);
      hg.style.strokeDashoffset = String(dash);
      hgText.textContent = String(Math.round(pct));
      hg.style.stroke = pct > 80 ? '#22d3ee' : pct > 60 ? '#38bdf8' : pct > 40 ? '#f59e0b' : '#ef4444';
    }
    let i = 0;
    setInterval(()=>{
      const p = canDataPoints[i % canDataPoints.length];
      // Apply simple scaling based on selected industry
      const fuelAdj = industry==='truck' ? 1.35 : industry==='construction' ? 1.15 : industry==='marine' ? 1.05 : 1.0;
      const coolantAdj = industry==='marine' ? 0.95 : 1.0;
      const idlePenalty = industry==='construction' ? 1 : 0;
      if (fuelEl) fuelEl.textContent = (p.fuel * fuelAdj).toFixed(1);
      if (coolantEl) coolantEl.textContent = String(Math.round(p.coolant * coolantAdj));
      if (voltEl) voltEl.textContent = String(p.voltage);
      if (scoreEl) scoreEl.textContent = String(92 - (p.brake? 3:0) - Math.max(0, Math.abs(p.steering)-5) - idlePenalty);
      if (voltStatusEl){
        const stable = p.voltage > 13.2 && p.voltage < 14.5;
        voltStatusEl.textContent = stable ? 'Stable' : 'Check';
        voltStatusEl.className = 'pill ' + (stable ? 'pill-stable' : 'pill-clean');
      }
      if (injEl) injEl.textContent = (p.maf > 3.6 || p.maf < 1.0) ? 'Inspect' : 'Good';
      if (dpfEl) dpfEl.textContent = (p.load > 60 && p.rpm < 1500) ? 'Soot↑' : 'Clean';
      setHealth(95 - Math.max(0, (p.rpm-3000)/50) - (p.brake? 5:0));
      i++;
    }, 1600);
  }

  // Wait for Leaflet to load (defer) then init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDriveMap();
      initAnimatedData();
      initSlideInAnimations();
      initPromoVideo(); // added
    });
  } else {
    initDriveMap();
    initAnimatedData();
    initSlideInAnimations();
    initPromoVideo(); // added
  }

  // Animated Data Visualization
  function initAnimatedData() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Animate KPI bar values
    function animateKPI(id, start, end, unit, duration = 1200) {
      const el = document.getElementById(id);
      if (!el) return;
      const valueEl = el.querySelector('.kpi-value');
      if (prefersReduced){
        valueEl.textContent = unit === '°C' ? Math.round(end) : end.toFixed(1);
        return;
      }
      let startTime;
      function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const val = (end - start) * progress + start;
        valueEl.textContent = unit === '°C' ? Math.round(val) : val.toFixed(1);
        if (progress < 1) requestAnimationFrame(step);
        else valueEl.textContent = unit === '°C' ? Math.round(end) : end.toFixed(1);
      }
      requestAnimationFrame(step);
    }
    animateKPI('kpi-fuel', 8.2, 6.8, 'L/100km');
    animateKPI('kpi-coolant', 75, 89, '°C');
    animateKPI('kpi-score', 80, 92, '');

    // Animated fuel economy chart
  const chartEl = document.getElementById('fuelChart');
  const ctx = chartEl ? chartEl.getContext('2d') : null;
    if (!ctx) return;
    if (prefersReduced){
      // Draw static chart frame only
      ctx.clearRect(0, 0, 320, 120);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(32, 16); ctx.lineTo(32, 104); ctx.lineTo(310, 104); ctx.stroke();
      return;
    }
    // Simulated data
    const data = [8.2, 7.9, 7.5, 7.2, 7.0, 6.9, 6.8, 6.8, 6.9, 7.0, 7.1, 7.0, 6.9, 6.8];
    let frame = 0;
    function drawChart() {
      ctx.clearRect(0, 0, 320, 120);
      // Axes
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(32, 16);
      ctx.lineTo(32, 104);
      ctx.lineTo(310, 104);
      ctx.stroke();
      // Line
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= frame; i++) {
        const x = 32 + (i * 20);
        const y = 104 - ((data[i] - 6.5) * 32);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Dots
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i <= frame; i++) {
        const x = 32 + (i * 20);
        const y = 104 - ((data[i] - 6.5) * 32);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
      // Animate
      if (frame < data.length - 1) {
        frame++;
        requestAnimationFrame(drawChart);
      }
    }
    drawChart();
  }

  // Promo video: play when visible, pause when off‑screen; honor reduced motion
  function initPromoVideo(){
    const vid = document.getElementById('promo-video');
    if (!vid) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    vid.muted = true;

    function tryPlay(){
      if (!prefersReduced) { vid.play().catch(()=>{}); }
    }

    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) tryPlay();
          else vid.pause();
        });
      }, { threshold: 0.5 });
      io.observe(vid);
    }

    document.addEventListener('visibilitychange', function(){
      if (document.hidden) vid.pause();
      else tryPlay();
    });
  }
})();
