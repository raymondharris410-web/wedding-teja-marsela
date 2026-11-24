// Gallery Module

window.WeddingGallery = (function() {
  const images = [
    { id: 1, category: 'prewedding', color: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', text: 'Prewedding 1' },
    { id: 2, category: 'engagement', color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', text: 'Engagement 1' },
    { id: 3, category: 'prewedding', color: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', text: 'Prewedding 2' },
    { id: 4, category: 'family', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', text: 'Family 1' },
    { id: 5, category: 'memories', color: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', text: 'Memories 1' },
    { id: 6, category: 'prewedding', color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', text: 'Prewedding 3' },
    { id: 7, category: 'engagement', color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', text: 'Engagement 2' },
    { id: 8, category: 'family', color: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)', text: 'Family 2' },
    { id: 9, category: 'prewedding', color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', text: 'Prewedding 4' },
    { id: 10, category: 'memories', color: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)', text: 'Memories 2' },
    { id: 11, category: 'prewedding', color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', text: 'Prewedding 5' },
    { id: 12, category: 'family', color: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', text: 'Family 3' }
  ];

  let currentCategory = 'all';
  let currentIndex = 0;
  let filteredImages = [];

  const init = () => {
    renderGallery();
    setupFilters();
    setupLightbox();
  };

  const renderGallery = () => {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    filteredImages = images.filter(img => currentCategory === 'all' || img.category === currentCategory);

    filteredImages.forEach((img, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item reveal reveal-zoom active';
      item.setAttribute('data-index', index);
      
      // Use CSS gradient as placeholder for image
      item.innerHTML = `
        <div class="gallery-img" style="background: ${img.color}; display: flex; justify-content: center; align-items: center; font-family: var(--font-heading); color: #555; font-size: 1.2rem;">
          ${img.text}
        </div>
      `;
      
      item.addEventListener('click', () => openLightbox(index));
      grid.appendChild(item);
    });
  };

  const setupFilters = () => {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        e.target.classList.add('active');
        
        currentCategory = e.target.getAttribute('data-filter');
        renderGallery();
      });
    });
  };

  const setupLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (!lightbox) return;

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    const handleSwipe = () => {
      const SWIPE_THRESHOLD = 50;
      if (touchEndX < touchStartX - SWIPE_THRESHOLD) showNext();
      if (touchEndX > touchStartX + SWIPE_THRESHOLD) showPrev();
    };
  };

  const openLightbox = (index) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    currentIndex = index;
    updateLightboxImage();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const updateLightboxImage = () => {
    const imgContainer = document.getElementById('lightbox-image');
    const counter = document.getElementById('lightbox-counter');
    
    if (!imgContainer || !counter) return;
    
    const img = filteredImages[currentIndex];
    
    // Replace with actual image when available, using div placeholder for now
    imgContainer.innerHTML = `
      <div style="width: 80vw; height: 80vh; max-width: 800px; max-height: 800px; background: ${img.color}; display: flex; justify-content: center; align-items: center; font-family: var(--font-heading); color: #555; font-size: 2rem; border-radius: 8px;">
        ${img.text}
      </div>
    `;
    
    counter.textContent = `${currentIndex + 1} / ${filteredImages.length}`;
  };

  const showPrev = () => {
    if (filteredImages.length === 0) return;
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightboxImage();
  };

  const showNext = () => {
    if (filteredImages.length === 0) return;
    currentIndex = (currentIndex + 1) % filteredImages.length;
    updateLightboxImage();
  };

  return {
    init
  };

})();
