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
  };

  const loadWishes = async () => {
    try {
      if (window.SupabaseClient && window.SupabaseClient.isConfigured()) {
        const { data } = await window.SupabaseClient.select('wishes', {
          select: '*',
          order: 'created_at.desc',
          limit: 100
        });
        wishesData = (data && data.length > 0) ? data : getDefaultWishes();
      } else {
        // Fallback: localStorage
        const saved = window.WeddingUtils.getLocalStorage('wedding_wishes');
        wishesData = saved && saved.length > 0 ? saved : getDefaultWishes();
      }
    } catch (err) {
      console.error('[Wishes] Load error:', err);
      wishesData = getDefaultWishes();
    }
  };

  const getDefaultWishes = () => {
    const now = Date.now();
    return [
      { id: 1, guest_name: 'Sarah Putri', message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang diberkati Tuhan. God bless! 🙏', created_at: new Date(now - 1000 * 5).toISOString() },
      { id: 2, guest_name: 'Budi Santoso', message: 'Happy Wedding Teja & Marsela! Bahagia selalu ya! 💒', created_at: new Date(now - 1000 * 15).toISOString() },
      { id: 3, guest_name: 'Amanda Christine', message: 'Tuhan memberkati pernikahan kalian. Semoga cinta kalian kekal hingga akhir hayat 💕', created_at: new Date(now - 1000 * 30).toISOString() },
      { id: 4, guest_name: 'David Wijaya', message: 'Congratulations bro! Finally! Semoga bahagia selalu! 🎉', created_at: new Date(now - 1000 * 45).toISOString() },
      { id: 5, guest_name: 'Jessica Tanujaya', message: 'So happy for you both! May God shower you with endless blessings! ✨', created_at: new Date(now - 1000 * 50).toISOString() },
      { id: 6, guest_name: 'Michael Pranata', message: 'Best wishes for the lovely couple! Semoga menjadi keluarga Kristen yang kokoh 🙌', created_at: new Date(now - 1000 * 55).toISOString() }
    ];
  };

  const render = () => {
    const listContainer = document.getElementById('wishes-list');
    const paginationContainer = document.getElementById('wishes-pagination');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (wishesData.length === 0) {
      listContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 40px 0;">Belum ada ucapan. Jadilah yang pertama memberikan doa! 🙏</p>';
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

  return { init, addWishLocal };
})();
