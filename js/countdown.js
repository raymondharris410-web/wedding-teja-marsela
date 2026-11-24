// Countdown Timer Module

window.WeddingCountdown = (function() {
  const TARGET_DATE = new Date('2026-12-05T13:00:00+07:00').getTime(); // 5 Dec 2026, 13:00 WIB
  let elements = {};
  let intervalId = null;

  const init = () => {
    const container = document.getElementById('countdown');
    if (!container) return;

    elements = {
      days: document.querySelector('.countdown-value[data-type="days"]'),
      hours: document.querySelector('.countdown-value[data-type="hours"]'),
      minutes: document.querySelector('.countdown-value[data-type="minutes"]'),
      seconds: document.querySelector('.countdown-value[data-type="seconds"]')
    };

    if (!elements.days) return;

    update(); // Initial call
    intervalId = setInterval(update, 1000);
  };

  const update = () => {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance < 0) {
      clearInterval(intervalId);
      displayFinished();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    renderValue(elements.days, formatNumber(days, 3));
    renderValue(elements.hours, formatNumber(hours, 2));
    renderValue(elements.minutes, formatNumber(minutes, 2));
    renderValue(elements.seconds, formatNumber(seconds, 2));
  };

  const renderValue = (element, newValue) => {
    if (element.textContent !== newValue) {
      // Create flip animation effect if values changed
      element.classList.add('flip');
      
      setTimeout(() => {
        element.textContent = newValue;
      }, 150); // Change number halfway through flip
      
      setTimeout(() => {
        element.classList.remove('flip');
      }, 300);
    }
  };

  const formatNumber = (num, padding) => {
    return num.toString().padStart(padding, '0');
  };

  const displayFinished = () => {
    const container = document.getElementById('countdown');
    if (container) {
      container.innerHTML = '<h3 style="font-family: var(--font-elegant); font-size: 2.5rem; color: var(--champagne); text-align: center; width: 100%;">Today is the day!</h3>';
    }
  };

  return {
    init
  };

})();
