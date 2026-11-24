// Navigation Module

window.WeddingNav = (function() {
  let navbar, hamburger, mobileMenu, navLinks, sections;

  const init = () => {
    navbar = document.getElementById('navbar');
    hamburger = document.getElementById('hamburger');
    mobileMenu = document.getElementById('mobile-menu');
    navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    sections = document.querySelectorAll('.section, #hero');

    if (!navbar) return;

    setupScroll();
    setupHamburger();
    setupSmoothScroll();
    setupIntersectionObserver();
  };

  const setupScroll = () => {
    const handleScroll = window.WeddingUtils.throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
  };

  const setupHamburger = () => {
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isActive = mobileMenu.classList.contains('active');
      
      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('active') && 
          !mobileMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });
  };

  const openMobileMenu = () => {
    mobileMenu.classList.add('active');
    
    // Animate hamburger to X
    const bars = hamburger.querySelectorAll('.bar');
    if (bars.length === 3) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    }
    
    document.body.style.overflow = 'hidden'; // Lock scroll
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    
    // Revert hamburger
    const bars = hamburger.querySelectorAll('.bar');
    if (bars.length === 3) {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
    
    document.body.style.overflow = ''; // Unlock scroll
  };

  const setupSmoothScroll = () => {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Only handle internal links
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          
          if (window.innerWidth <= 768) {
            closeMobileMenu();
          }
          
          window.WeddingUtils.smoothScrollTo(targetId.substring(1));
        }
      });
    });
  };

  const setupIntersectionObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of screen
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          updateActiveLinks(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
      if (section.id !== 'cover') { // Don't observe cover for nav highlighting
        observer.observe(section);
      }
    });
  };

  const updateActiveLinks = (id) => {
    if (!id) return;
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      }
    });
  };

  return {
    init,
    updateActiveLinks
  };

})();
