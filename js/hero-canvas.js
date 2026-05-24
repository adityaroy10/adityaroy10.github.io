(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height;
  let particles = [];
  const particleCount = 500; // Increased density for a richer galaxy effect
  
  // Track mouse position relative to canvas
  let mouse = { x: -1000, y: -1000 };
  
  
  function resize() {
    // Make canvas full screen globally
    width = window.innerWidth;
    height = window.innerHeight;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = Math.random() * 1.5 + 0.5;
      // USC Cardinal and Gold
      this.baseColor = Math.random() > 0.5 ? 'rgba(153, 0, 0, ' : 'rgba(255, 204, 0, '; 
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.invisible = false;
    }

    update() {
      
      // Organic wandering motion
      this.wanderAngle += (Math.random() - 0.5) * 0.3;
      this.vx += Math.cos(this.wanderAngle) * 0.05;
      this.vy += Math.sin(this.wanderAngle) * 0.05;

      // Swarm attraction towards mouse
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 400 && mouse.x !== -1000) {
        // Attract forcefully if close, creating a swirling swarm
        let force = (400 - dist) / 400;
        this.vx += (dx / dist) * force * 0.8;
        this.vy += (dy / dist) * force * 0.8;
      }
      
      this.invisible = (dist < 50 && mouse.x !== -1000);

      // Natural Friction
      this.vx *= 0.95;
      this.vy *= 0.95;

      // Maintain a constant minimum floating speed
      let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed < 0.3) {
        this.vx *= 1.1;
        this.vy *= 1.1;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Screen wrap-around or cull if overpopulated
      if (this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20) {
        if (particles.length > particleCount) {
          this.dead = true;
        } else {
          if (this.x < -20) this.x = width + 20;
          if (this.x > width + 20) this.x = -20;
          if (this.y < -20) this.y = height + 20;
          if (this.y > height + 20) this.y = -20;
        }
      }
    }

    draw() {
      // Inner glowing core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.9)';
      ctx.fill();
      
      // Outer soft glow aura
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
      let gradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 4);
      gradient.addColorStop(0, this.baseColor + '0.2)');
      gradient.addColorStop(1, this.baseColor + '0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('click', (e) => {
    let cx = e.clientX;
    let cy = e.clientY;
    
    // Scatter existing particles too
    particles.forEach(p => {
      let dx = p.x - cx;
      let dy = p.y - cy;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 600) { 
        let force = Math.pow((600 - dist) / 600, 2); 
        p.vx += (dx / dist) * force * 50;
        p.vy += (dy / dist) * force * 50;
      }
    });
  });

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    // Fade out previous frame slightly to create motion trails
    ctx.clearRect(0, 0, width, height);
    
    // Cull dead particles that flew off-screen
    particles = particles.filter(p => !p.dead);

    let glowCharge = 0;
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      if (particles[i].invisible) {
        glowCharge++;
      }
    }
    
    // Draw mouse energy aura
    if (mouse.x !== -1000 && glowCharge > 0) {
      let auraRadius = Math.min(150, 20 + glowCharge * 2.0);
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, auraRadius, 0, Math.PI * 2);
      let auraGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, auraRadius);
      auraGrad.addColorStop(0, `rgba(255, 204, 0, ${Math.min(0.35, glowCharge * 0.02)})`);
      auraGrad.addColorStop(1, 'rgba(255, 204, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
    
    // Draw constellation-like webbing between nearby swarm particles
    for (let i = 0; i < particles.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < particles.length; j++) {
        if (connections > 7) break; // Prevents O(N^2) canvas stroke lag when particles clump
        
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = dx * dx + dy * dy;
        
        // Connect if close enough
        if (dist < 6000) { 
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 204, 0, ${0.1 - (dist / 6000) * 0.1})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          connections++;
        }
      }
    }

    // Webbing already drawn above

    requestAnimationFrame(animate);
  }

  animate();
})();
