(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height;
  let particles = [];
  const particleCount = 350; // Increased density for a richer galaxy effect
  
  // Track mouse position relative to canvas
  let mouse = { x: -1000, y: -1000 };
  
  function resize() {
    // Make canvas full screen of its container
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  document.getElementById('hero').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  document.getElementById('hero').addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  document.getElementById('hero').addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    let cx = e.clientX - rect.left;
    let cy = e.clientY - rect.top;
    
    // Explosive scatter shockwave
    particles.forEach(p => {
      let dx = p.x - cx;
      let dy = p.y - cy;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 600) { // Large shockwave radius
        let force = Math.pow((600 - dist) / 600, 2); // Non-linear force dropoff for punchier explosion
        // Apply massive velocity outward
        p.vx += (dx / dist) * force * 50;
        p.vy += (dy / dist) * force * 50;
      }
    });
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = Math.random() * 1.5 + 0.5;
      // Vibrant teal and indigo
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 255, 204, ' : 'rgba(102, 126, 234, '; 
      this.wanderAngle = Math.random() * Math.PI * 2;
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

      // Screen wrap-around
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
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

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    // Fade out previous frame slightly to create motion trails
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    // Draw constellation-like webbing between nearby swarm particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = dx * dx + dy * dy;
        
        // Connect if close enough
        if (dist < 6000) { 
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 204, ${0.1 - (dist / 6000) * 0.1})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
