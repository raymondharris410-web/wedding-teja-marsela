// =====================================================
// RSVP MODULE — Supabase Integration
// =====================================================

window.WeddingRSVP = (function() {
  let isSubmitting = false;

  const init = () => {
    const form = document.getElementById('rsvp-form');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    // Clear errors on input
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => clearError(input.name));
      input.addEventListener('change', () => clearError(input.name));
    });

    // Show/hide guest count based on attendance selection
    const radioButtons = form.querySelectorAll('input[name="konfirmasi"]');
    const guestCountGroup = document.getElementById('guest-count-group');

    radioButtons.forEach(radio => {
      radio.addEventListener('change', () => {
        if (guestCountGroup) {
          if (radio.value === 'hadir') {
            guestCountGroup.style.display = 'block';
            guestCountGroup.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            guestCountGroup.style.display = 'none';
          }
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.target;
    if (!validate(form)) return;

    const formData = new FormData(form);
    const attendance = formData.get('konfirmasi');

    const rsvpData = {
      guest_name: formData.get('nama').trim(),
      whatsapp: formData.get('whatsapp')?.trim() || null,
      attendance: attendance,
      guest_count: attendance === 'hadir' ? parseInt(formData.get('jumlah_tamu') || '1') : 0,
      message: formData.get('ucapan')?.trim() || null
    };

    isSubmitting = true;
    setButtonLoading(form, true);

    try {
      // Check if Supabase is configured
      if (window.SupabaseClient && window.SupabaseClient.isConfigured()) {
        // Save to Supabase
        await window.SupabaseClient.insert('rsvp', rsvpData);

        // Also save wish to wishes table if message provided
        if (rsvpData.message) {
          await window.SupabaseClient.insert('wishes', {
            guest_name: rsvpData.guest_name,
            message: rsvpData.message
          });
        }
      } else {
        // Fallback to localStorage
        console.warn('[RSVP] Supabase not configured, saving to localStorage');
        const rsvpList = window.WeddingUtils.getLocalStorage('wedding_rsvp') || [];
        rsvpList.push({ ...rsvpData, id: Date.now(), created_at: new Date().toISOString() });
        window.WeddingUtils.setLocalStorage('wedding_rsvp', rsvpList);

        if (rsvpData.message && window.WeddingWishes) {
          window.WeddingWishes.addWishLocal(rsvpData.guest_name, rsvpData.message);
        }
      }

      showSuccess(form);
      showToast('RSVP berhasil dikirim! Terima kasih 🎉', 'success');

    } catch (error) {
      console.error('[RSVP] Submit error:', error);
      showToast('Gagal mengirim RSVP. Silakan coba lagi.', 'error');
    } finally {
      isSubmitting = false;
      setButtonLoading(form, false);
    }
  };

  const validate = (form) => {
    let isValid = true;
    clearAllErrors();

    const nama = form.nama.value.trim();
    if (!nama) {
      showError('nama', 'Nama wajib diisi');
      isValid = false;
    } else if (nama.length < 2) {
      showError('nama', 'Nama minimal 2 karakter');
      isValid = false;
    }

    // WhatsApp is optional per spec
    const whatsapp = form.whatsapp?.value?.trim();
    if (whatsapp && (!/^[0-9+\-\s]+$/.test(whatsapp) || whatsapp.length < 9)) {
      showError('whatsapp', 'Nomor WhatsApp tidak valid');
      isValid = false;
    }

    const konfirmasi = form.elements['konfirmasi']?.value;
    if (!konfirmasi) {
      showError('konfirmasi', 'Silakan pilih konfirmasi kehadiran');
      isValid = false;
    }

    // Guest count required only if attending
    if (konfirmasi === 'hadir') {
      const jumlah = form.jumlah_tamu?.value;
      if (!jumlah) {
        showError('jumlah', 'Silakan pilih jumlah tamu');
        isValid = false;
      }
    }

    return isValid;
  };

  const showError = (fieldName, message) => {
    const errorEl = document.getElementById(`error-${fieldName}`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  };

  const clearError = (fieldName) => {
    const mappings = { 'jumlah_tamu': 'jumlah' };
    const id = mappings[fieldName] || fieldName;
    const errorEl = document.getElementById(`error-${id}`);
    if (errorEl) errorEl.textContent = '';
  };

  const clearAllErrors = () => {
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
    });
  };

  const setButtonLoading = (form, loading) => {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    if (loading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Mengirim...</span>
      `;
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalText || 'Kirim RSVP';
    }
  };

  const showSuccess = (form) => {
    form.style.display = 'none';
    const successMsg = document.getElementById('rsvp-success');
    if (successMsg) {
      successMsg.classList.add('active');
      createConfetti();
    }
  };

  const createConfetti = () => {
    const colors = ['#D4AF37', '#C41E3A', '#E8D48B', '#FFFFFF', '#8B0000'];
    const container = document.getElementById('rsvp');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute; width: ${6 + Math.random() * 8}px; height: ${6 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: 50%; left: 50%; z-index: 999; border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;

      const angle = Math.random() * Math.PI * 2;
      const velocity = 60 + Math.random() * 120;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 120;

      confetti.animate([
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg) scale(0)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 800,
        easing: 'cubic-bezier(.37,0,.63,1)',
        fill: 'forwards'
      });

      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2200);
    }
  };

  const showToast = (message, type) => {
    if (window.WeddingApp && window.WeddingApp.showToast) {
      window.WeddingApp.showToast(message, type);
    }
  };

  return { init };
})();
