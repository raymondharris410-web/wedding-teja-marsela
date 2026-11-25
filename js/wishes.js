// =====================================================
// WISHES MODULE — Supabase Integration
// =====================================================

window.WeddingWishes = (function() {
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let wishesData = [];
  let isLoading = false;

  const init = async () => {
    await loadWishes();
    render();

    // Auto-refresh wishes every 20 seconds for real-time live updates
    setInterval(async () => {
      await loadWishes();
      render();
    }, 20000);
  };

  const loadWishes = async () => {
    try {
      if (window.SupabaseClient && window.SupabaseClient.isConfigured()) {
        const { data } = await window.SupabaseClient.select('wishes', {
          select: '*',
          order: 'created_at.desc',
          limit: 100
        });
        wishesData = data || [];
      } else {
        // Fallback: localStorage
        const saved = window.WeddingUtils.getLocalStorage('wedding_wishes');
        wishesData = saved || [];
      }
    } catch (err) {
      console.error('[Wishes] Load error:', err);
      const saved = window.WeddingUtils.getLocalStorage('wedding_wishes');
      wishesData = saved || [];
    }
  };

  const refresh = async () => {
    await loadWishes();
    currentPage = 1;
    render();
  };

  const render = () => {
    const listContainer = document.getElementById('wishes-list');
    const paginationContainer = document.getElementById('wishes-pagination');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (wishesData.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-wishes-box" style="text-align:center; padding: 40px 20px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(212,175,55,0.3); border-radius: 16px; max-width: 500px; margin: 0 auto;">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">💌</span>
          <p style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--gold-primary); margin-bottom: 8px;">Belum Ada Ucapan</p>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">Jadilah yang pertama memberikan doa restu untuk Teja & Marsela melalui formulir RSVP di atas! ✨</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageWishes = wishesData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    pageWishes.forEach((wish, index) => {
      const card = document.createElement('div');
      card.className = 'wish-card reveal reveal-up active';
      card.style.animationDelay = `${index * 0.08}s`;

      // Use guest_name field (Supabase) or name field (legacy)
      const name = wish.guest_name || wish.name || 'Guest';
      const message = wish.message || '';
      const date = wish.created_at || wish.date || new Date().toISOString();
      const avatarHtml = window.WeddingUtils.generateAvatar(name);
      const timeString = window.WeddingUtils.timeAgo(date);

      card.innerHTML = `
        ${avatarHtml}
        <div class="wish-content">
          <div class="wish-header">
            <span class="wish-name">${window.WeddingUtils.sanitizeHTML(name)}</span>
            <span class="wish-date">${timeString}</span>
          </div>
          <p class="wish-message">${window.WeddingUtils.sanitizeHTML(message)}</p>
        </div>
      `;

      listContainer.appendChild(card);
    });

    renderPagination(paginationContainer);
  };

  const renderPagination = (container) => {
    if (!container) return;
    container.innerHTML = '';

    const totalPages = Math.ceil(wishesData.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        render();
        window.WeddingUtils.smoothScrollTo('guest-wishes');
      });
      container.appendChild(btn);
    }
  };

  // Called from RSVP when Supabase is not configured (localStorage fallback)
  const addWishLocal = (name, message) => {
    const newWish = {
      id: Date.now(),
      guest_name: name,
      message: message,
      created_at: new Date().toISOString()
    };
    wishesData.unshift(newWish);
    window.WeddingUtils.setLocalStorage('wedding_wishes', wishesData);
    currentPage = 1;
    render();
  };

  return { init, addWishLocal, refresh };
})();
