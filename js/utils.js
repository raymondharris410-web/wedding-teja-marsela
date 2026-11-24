// Utility Functions

window.WeddingUtils = (function() {
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (e) {
        textArea.remove();
        return false;
      }
    }
  };

  const formatDate = (dateString, format = 'full') => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    if (format === 'short') {
      return date.toLocaleDateString('id-ID');
    }
    
    return date.toLocaleDateString('en-US', options);
  };

  const debounce = (fn, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const throttle = (fn, delay) => {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return fn.apply(this, args);
    };
  };

  const getLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return null;
    }
  };

  const setLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  };

  const generateAvatar = (name) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
    const colorIndex = name ? name.length % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return `<div class="wish-avatar" style="background-color: ${bgColor}">${initial}</div>`;
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      
      window.scrollTo({
        top: offsetTop - navbarHeight,
        behavior: 'smooth'
      });
    }
  };

  const createRipple = (event, element) => {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rect = element.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 0.6s linear';
    circle.style.pointerEvents = 'none';

    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    circle.classList.add('ripple');
    element.appendChild(circle);
    
    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  return {
    copyToClipboard,
    formatDate,
    debounce,
    throttle,
    getLocalStorage,
    setLocalStorage,
    generateAvatar,
    timeAgo,
    sanitizeHTML,
    formatNumber,
    isMobile,
    smoothScrollTo,
    createRipple
  };

})();
