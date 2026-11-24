// Music Player Module

window.WeddingMusic = (function() {
  let audio = null;
  let isPlaying = false;
  let isMuted = false;
  let btnMusic = null;

  const init = () => {
    audio = document.getElementById('bg-music');
    btnMusic = document.getElementById('btn-music');
    
    if (!audio) {
      console.warn('Audio element not found');
      return;
    }

    // Try to restore state
    const savedState = window.WeddingUtils.getLocalStorage('wedding_music_state');
    if (savedState) {
      isMuted = savedState.isMuted || false;
      audio.muted = isMuted;
    }

    if (btnMusic) {
      btnMusic.addEventListener('click', toggle);
    }
  };

  const play = () => {
    if (!audio) return;
    
    try {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          updateUI();
          saveState();
        }).catch(error => {
          console.log('Auto-play prevented or file not found', error);
          isPlaying = false;
          updateUI();
        });
      }
    } catch (e) {
      console.error('Error playing audio', e);
    }
  };

  const pause = () => {
    if (!audio) return;
    
    audio.pause();
    isPlaying = false;
    updateUI();
    saveState();
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const updateUI = () => {
    if (!btnMusic) return;
    
    if (isPlaying) {
      btnMusic.innerHTML = '⏸️';
      btnMusic.classList.add('playing');
    } else {
      btnMusic.innerHTML = '🎵';
      btnMusic.classList.remove('playing');
    }
  };

  const saveState = () => {
    window.WeddingUtils.setLocalStorage('wedding_music_state', {
      isPlaying,
      isMuted
    });
  };

  return {
    init,
    play,
    pause,
    toggle,
    get isPlaying() { return isPlaying; }
  };

})();
