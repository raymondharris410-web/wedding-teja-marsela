// Main Application Controller

window.WeddingApp = (function() {

  const init = () => {
    // 1. Show loading screen & handle transition
    handleLoading();

    // 2. Initialize Supabase client
    if (window.SupabaseClient) window.SupabaseClient.init();

    // 3. Initialize modules after DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize core modules (except music, waiting for interaction)
      if (window.WeddingNav) window.WeddingNav.init();
      if (window.WeddingCountdown) window.WeddingCountdown.init();
      if (window.WeddingAnimations) window.WeddingAnimations.init();
      if (window.WeddingGallery) window.WeddingGallery.init();
      if (window.WeddingRSVP) window.WeddingRSVP.init();
      if (window.WeddingWishes) window.WeddingWishes.init();
      if (window.WeddingMusic) window.WeddingMusic.init();
      
      // Setup UI interactions
      setupCover();
      setupFloatingButtons();
      setupFAQ();
      setupGiftTabs();
      setupVideoPopup();
      setupRippleButtons();
      
      // Force scroll to top on reload to ensure proper flow
      window.scrollTo(0, 0);
    });
  };

  const handleLoading = () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Simulate loading time (usually this would wait for assets to load)
    setTimeout(() => {
      loadingScreen.classList.add('loaded');
      
      // Cleanup loading screen after transition
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 1000);
    }, 3500); // 3.5 seconds loading animation
  };

  const setupCover = () => {
    const coverBtn = document.getElementById('cover-btn');
    const cover = document.getElementById('cover');
    const guestNameEl = document.getElementById('guest-name');
    
    if (!coverBtn || !cover) return;

    // Check for guest name in URL parameter (e.g. ?to=John+Doe)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName && guestNameEl) {
      guestNameEl.textContent = window.WeddingUtils.sanitizeHTML(guestName);
    }

    coverBtn.addEventListener('click', () => {
      // 1. Try to play music (user interaction required for audio)
      if (window.WeddingMusic) window.WeddingMusic.play();
      
      // 2. Animate cover sliding up
      cover.style.transform = 'translateY(-100vh)';
      
      // 3. Show navbar
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.style.opacity = '1';
      
      // 4. Initialize animations that might be below cover
      setTimeout(() => {
        // Trigger scroll event to ensure navbar and reveals update
        window.dispatchEvent(new Event('scroll'));
        
        // Hide cover completely for performance
        cover.style.display = 'none';
      }, 1000); // Wait for transition
    });
  };


  const setupFloatingButtons = () => {
    const btnTop = document.getElementById('btn-top');
    const btnShare = document.getElementById('btn-share');
    
    if (btnTop) {
      // Show/hide based on scroll
      window.addEventListener('scroll', window.WeddingUtils.throttle(() => {
        if (window.scrollY > 500) {
          btnTop.style.display = 'flex';
          btnTop.style.animation = 'fadeIn 0.3s forwards';
        } else {
          btnTop.style.animation = 'fadeOut 0.3s forwards';
          setTimeout(() => {
            if (window.scrollY <= 500) btnTop.style.display = 'none';
          }, 300);
        }
      }, 200));

      btnTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (btnShare) {
      btnShare.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({
            title: 'Wedding of Teja & Marsela',
            text: 'You are invited to the Holy Matrimony of Teja & Marsela.',
            url: window.location.href,
          })
          .catch((error) => console.log('Error sharing', error));
        } else {
          // Fallback: copy to clipboard
          window.WeddingUtils.copyToClipboard(window.location.href)
            .then(() => showToast('Link copied to clipboard!'))
            .catch(() => showToast('Failed to copy link', 'error'));
        }
      });
    }
  };

  const setupFAQ = () => {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all other items (accordion behavior)
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  };

  const setupGiftTabs = () => {
    const tabs = document.querySelectorAll('.gift-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.gift-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.gift-tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const targetId = `tab-${tab.getAttribute('data-tab')}`;
        document.getElementById(targetId).classList.add('active');
      });
    });
  };

  const copyGift = (buttonElement) => {
    const textToCopy = buttonElement.getAttribute('data-copy');
    if (!textToCopy) return;

    window.WeddingUtils.copyToClipboard(textToCopy).then(success => {
      if (success) {
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '✓ Copied!';
        buttonElement.classList.add('copied');
        
        showToast('Copied to clipboard!', 'success');
        
        setTimeout(() => {
          buttonElement.innerHTML = originalText;
          buttonElement.classList.remove('copied');
        }, 2000);
      }
    });
  };

  const setupVideoPopup = () => {
    const overlay = document.getElementById('video-overlay');
    const iframe = document.getElementById('video-iframe');
    
    if (!overlay || !iframe) return;

    overlay.addEventListener('click', () => {
      const src = iframe.getAttribute('data-src');
      // Append autoplay if not present
      const finalSrc = src.includes('?') ? `${src}&autoplay=1` : `${src}?autoplay=1`;
      
      iframe.setAttribute('src', finalSrc);
      iframe.style.display = 'block';
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    });
  };

  const setupRippleButtons = () => {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .floating-btn, .gift-tab');
    
    buttons.forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        window.WeddingUtils.createRipple(e, btn);
      });
    });
  };

  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add icon based on type
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    
    toast.innerHTML = `<span style="margin-right: 8px;">${icon}</span> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  const addToCalendar = (type) => {
    const title = 'Pemberkatan Nikah: Teja & Marsela';
    const description = 'Join us to celebrate our Holy Matrimony.';
    const location = 'GBI Haleluya Purwokerto';
    const st = '20261205T060000Z'; // 13:00 WIB (UTC+7) = 06:00 UTC
    const et = '20261205T080000Z'; // 15:00 WIB = 08:00 UTC

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${st}/${et}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  // Expose necessary functions
  return {
    init,
    copyGift,
    addToCalendar,
    showToast
  };

})();

// Start the application
window.WeddingApp.init();
