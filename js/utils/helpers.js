/**
 * HELPERS.JS - Yardımcı Fonksiyonlar
 * Cyber-Nature Theme | Utility Functions
 */

const Helpers = {
  /**
   * DOM elementi seçici
   * @param {string} selector - CSS seçici
   * @returns {HTMLElement|null}
   */
  $(selector) {
    return document.querySelector(selector);
  },

  /**
   * DOM elementleri seçici (çoklu)
   * @param {string} selector - CSS seçici
   * @returns {NodeList}
   */
  $$(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Rastgele sayı üret
   * @param {number} min - Minimum değer
   * @param {number} max - Maximum değer
   * @returns {number}
   */
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  /**
   * Rastgele tam sayı üret
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Değeri bir aralığa sınırla
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Değeri bir aralıktan başka bir aralığa dönüştür
   * @param {number} value
   * @param {number} inMin
   * @param {number} inMax
   * @param {number} outMin
   * @param {number} outMax
   * @returns {number}
   */
  map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  },

  /**
   * Linear interpolation
   * @param {number} start
   * @param {number} end
   * @param {number} t - 0-1 arası değer
   * @returns {number}
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * İki nokta arası mesafe
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns {number}
   */
  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  /**
   * Derece -> Radyan
   * @param {number} degrees
   * @returns {number}
   */
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  },

  /**
   * Radyan -> Derece
   * @param {number} radians
   * @returns {number}
   */
  radToDeg(radians) {
    return radians * (180 / Math.PI);
  },

  /**
   * Gecikme Promise'i
   * @param {number} ms - Milisaniye
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Debounce fonksiyonu
   * @param {Function} func
   * @param {number} wait
   * @returns {Function}
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle fonksiyonu
   * @param {Function} func
   * @param {number} limit
   * @returns {Function}
   */
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Açıyı 0-360 aralığında normalize et
   * @param {number} angle
   * @returns {number}
   */
  normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
  },

  /**
   * İki açı arasındaki fark
   * @param {number} angle1
   * @param {number} angle2
   * @returns {number}
   */
  angleDiff(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2) % 360;
    return diff > 180 ? 360 - diff : diff;
  },

  /**
   * Mobil cihaz kontrolü
   * @returns {boolean}
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  },

  /**
   * iOS cihaz kontrolü
   * @returns {boolean}
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  /**
   * Touch desteği kontrolü
   * @returns {boolean}
   */
  hasTouch() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Rastgele hex renk oluştur
   * @returns {string}
   */
  randomColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  },

  /**
   * Rastgele ID oluştur
   * @param {number} length
   * @returns {string}
   */
  generateId(length = 8) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Element görünür mü kontrolü
   * @param {HTMLElement} el
   * @returns {boolean}
   */
  isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  },

  /**
   * Koordinatları ekran sınırları içinde tut
   * @param {number} x
   * @param {number} y
   * @param {number} padding
   * @returns {{x: number, y: number}}
   */
  keepInBounds(x, y, padding = 0) {
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    return {
      x: this.clamp(x, padding, maxX),
      y: this.clamp(y, padding, maxY),
    };
  },

  /**
   * Sayıyı sıfır ile doldur
   * @param {number} num
   * @param {number} places
   * @returns {string}
   */
  zeroPad(num, places = 2) {
    return String(num).padStart(places, "0");
  },

  /**
   * Şu anki zamanı formatla
   * @returns {string}
   */
  getCurrentTime() {
    const now = new Date();
    return `${this.zeroPad(now.getHours())}:${this.zeroPad(now.getMinutes())}:${this.zeroPad(now.getSeconds())}`;
  },

  /**
   * Rastgele koordinat string oluştur
   * @returns {string}
   */
  randomCoord() {
    const lat = this.random(-90, 90).toFixed(4);
    const lng = this.random(-180, 180).toFixed(4);
    return `${lat}°, ${lng}°`;
  },

  /**
   * Rastgele hex string oluştur
   * @param {number} length
   * @returns {string}
   */
  randomHex(length = 8) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
    }
    return result;
  },
};

// Global erişim
window.Helpers = Helpers;

export default Helpers;
