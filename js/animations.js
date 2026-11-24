// Animations & Effects Module

window.WeddingAnimations = (function() {

  const init = () => {
    setupScrollReveal();
    setupGoldParticles();
    // Parallax can be added if needed on specific elements
  };

  const setupScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    if (reveals.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -15% 0px', // Trigger slightly before it comes into view
      threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, don't hide it again (unobserve)
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    reveals.forEach(reveal => {
      observer.observe(reveal);
    });
  };

  const setupGoldParticles = () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', window.WeddingUtils.debounce(resize, 200));
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 0.5; // 0.5 to 2.5 px
        this.speedY = Math.random() * 0.5 + 0.2; // 0.2 to 0.7
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1; // 0.1 to 0.6
        
        // Gold variations
        const golds = ['#D4AF37', '#E8D48B', '#B8960F', '#F3E5AB'];
        this.color = golds[Math.floor(Math.random() * golds.length)];
        
        // For horizontal sway
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y -= this.speedY; // Move up
        this.x += Math.sin(this.angle) * 0.5 + this.speedX; // Sway
        this.angle += this.angleSpeed;

        // Reset if off screen (top or sides)
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
        if (this.x > width + 10) this.x = -10;
        if (this.x < -10) this.x = width + 10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }

    // Create particles based on screen size (max 80)
    const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Add a very subtle gradient background to canvas? No, keep it transparent.
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    };

    // Start animation if not prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      animate();
    }
  };

  return {
    init
  };

})();
