/**
 * TRANSITIONS.JS - GSAP Ekran Geçiş Animasyonları
 * Cyber-Nature Theme | Screen Transitions Module
 * 
 * GSAP Timeline ile akıcı ekran geçişleri
 */

import AppState from './state.js';

const Transitions = {
  /**
   * Ekran geçişi yap
   * @param {string} fromScreen - Mevcut ekran ID'si
   * @param {string} toScreen - Hedef ekran ID'si
   * @param {Object} options - Geçiş seçenekleri
   */
  async goto(fromScreen, toScreen, options = {}) {
    const {
      direction = 'left', // left, right, up, down, fade
      duration = 0.6,
      onComplete = null
    } = options;
    
    const fromEl = document.getElementById(fromScreen);
    const toEl = document.getElementById(toScreen);
    
    if (!fromEl || !toEl) {
      console.error('Screen not found:', fromScreen, toScreen);
      return;
    }
    
    // GSAP Timeline oluştur
    const tl = gsap.timeline({
      onComplete: () => {
        fromEl.classList.remove('active');
        AppState.set('currentScreen', toScreen);
        if (onComplete) onComplete();
      }
    });
    
    // Hedef ekranı görünür yap
    toEl.style.visibility = 'visible';
    toEl.style.opacity = '0';
    
    // Yön bazlı animasyonlar
    switch (direction) {
      case 'left':
        tl.to(fromEl, {
          x: '-100%',
          opacity: 0,
          duration: duration,
          ease: 'power2.inOut'
        })
        .fromTo(toEl, 
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: duration, ease: 'power2.out' },
          '-=0.3'
        );
        break;
        
      case 'right':
        tl.to(fromEl, {
          x: '100%',
          opacity: 0,
          duration: duration,
          ease: 'power2.inOut'
        })
        .fromTo(toEl,
          { x: '-100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: duration, ease: 'power2.out' },
          '-=0.3'
        );
        break;
        
      case 'up':
        tl.to(fromEl, {
          y: '-100%',
          opacity: 0,
          duration: duration,
          ease: 'power2.inOut'
        })
        .fromTo(toEl,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: duration, ease: 'power2.out' },
          '-=0.3'
        );
        break;
        
      case 'down':
        tl.to(fromEl, {
          y: '100%',
          opacity: 0,
          duration: duration,
          ease: 'power2.inOut'
        })
        .fromTo(toEl,
          { y: '-100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: duration, ease: 'power2.out' },
          '-=0.3'
        );
        break;
        
      case 'fade':
      default:
        tl.to(fromEl, {
          opacity: 0,
          duration: duration / 2,
          ease: 'power2.in'
        })
        .set(fromEl, { visibility: 'hidden' })
        .fromTo(toEl,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: duration / 2, ease: 'power2.out' }
        );
        break;
        
      case 'zoom':
        tl.to(fromEl, {
          scale: 1.2,
          opacity: 0,
          duration: duration,
          ease: 'power2.in'
        })
        .fromTo(toEl,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: duration, ease: 'power2.out' },
          '-=0.2'
        );
        break;
        
      case 'glitch':
        // Glitch efektli geçiş
        tl.to(fromEl, {
          opacity: 0,
          duration: 0.1,
          ease: 'steps(5)'
        })
        .to(fromEl, {
          opacity: 1,
          duration: 0.05
        })
        .to(fromEl, {
          opacity: 0,
          x: 10,
          duration: 0.1
        })
        .to(fromEl, {
          x: -10,
          duration: 0.05
        })
        .set(fromEl, { visibility: 'hidden', x: 0 })
        .fromTo(toEl,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }
        );
        break;
    }
    
    // Hedef ekranı aktif yap
    toEl.classList.add('active');
    
    return tl;
  },
  
  /**
   * Element giriş animasyonu
   * @param {HTMLElement|string} element - Element veya selector
   * @param {Object} options - Animasyon seçenekleri
   */
  animateIn(element, options = {}) {
    const {
      type = 'fadeUp',
      duration = 0.5,
      delay = 0,
      stagger = 0.1
    } = options;
    
    const el = typeof element === 'string' ? document.querySelectorAll(element) : element;
    
    const animations = {
      fadeUp: { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0 } },
      fadeDown: { from: { opacity: 0, y: -30 }, to: { opacity: 1, y: 0 } },
      fadeLeft: { from: { opacity: 0, x: 30 }, to: { opacity: 1, x: 0 } },
      fadeRight: { from: { opacity: 0, x: -30 }, to: { opacity: 1, x: 0 } },
      scale: { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } },
      pop: { from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1, ease: 'back.out(1.7)' } }
    };
    
    const anim = animations[type] || animations.fadeUp;
    
    return gsap.fromTo(el, anim.from, {
      ...anim.to,
      duration,
      delay,
      stagger,
      ease: anim.to.ease || 'power2.out'
    });
  },
  
  /**
   * Element çıkış animasyonu
   * @param {HTMLElement|string} element
   * @param {Object} options
   */
  animateOut(element, options = {}) {
    const {
      type = 'fadeUp',
      duration = 0.3,
      delay = 0
    } = options;
    
    const el = typeof element === 'string' ? document.querySelectorAll(element) : element;
    
    const animations = {
      fadeUp: { opacity: 0, y: -30 },
      fadeDown: { opacity: 0, y: 30 },
      fadeLeft: { opacity: 0, x: -30 },
      fadeRight: { opacity: 0, x: 30 },
      scale: { opacity: 0, scale: 0.8 }
    };
    
    return gsap.to(el, {
      ...animations[type],
      duration,
      delay,
      ease: 'power2.in'
    });
  },
  
  /**
   * Pulse animasyonu
   * @param {HTMLElement|string} element
   * @param {Object} options
   */
  pulse(element, options = {}) {
    const { scale = 1.1, duration = 0.3, repeat = 0 } = options;
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    return gsap.to(el, {
      scale,
      duration,
      yoyo: true,
      repeat: repeat * 2,
      ease: 'power2.inOut'
    });
  },
  
  /**
   * Shake animasyonu
   * @param {HTMLElement|string} element
   * @param {Object} options
   */
  shake(element, options = {}) {
    const { intensity = 5, duration = 0.5 } = options;
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    return gsap.to(el, {
      x: intensity,
      duration: duration / 10,
      yoyo: true,
      repeat: 10,
      ease: 'power2.inOut',
      onComplete: () => gsap.set(el, { x: 0 })
    });
  },
  
  /**
   * Typewriter efekti
   * @param {HTMLElement|string} element
   * @param {string} text
   * @param {Object} options
   */
  typewriter(element, text, options = {}) {
    const { speed = 50, delay = 0, onComplete = null } = options;
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    el.textContent = '';
    let index = 0;
    
    return new Promise(resolve => {
      setTimeout(() => {
        const interval = setInterval(() => {
          el.textContent += text[index];
          index++;
          
          if (index === text.length) {
            clearInterval(interval);
            if (onComplete) onComplete();
            resolve();
          }
        }, speed);
      }, delay);
    });
  },
  
  /**
   * Flash efekti
   * @param {string} color
   * @param {number} duration
   */
  flash(color = '#ffffff', duration = 0.5) {
    const flash = document.getElementById('flash-overlay');
    if (!flash) return;
    
    flash.style.background = color;
    
    return gsap.timeline()
      .to(flash, { opacity: 1, duration: 0.1 })
      .to(flash, { opacity: 0, duration: duration - 0.1 });
  },
  
  /**
   * Glow pulse efekti
   * @param {HTMLElement|string} element
   * @param {Object} options
   */
  glowPulse(element, options = {}) {
    const { color = '#00FFFF', duration = 1, repeat = -1 } = options;
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    return gsap.to(el, {
      boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`,
      duration,
      yoyo: true,
      repeat,
      ease: 'power2.inOut'
    });
  },
  
  /**
   * Sürtünmeli sayaç animasyonu
   * @param {HTMLElement|string} element
   * @param {number} start
   * @param {number} end
   * @param {Object} options
   */
  countTo(element, start, end, options = {}) {
    const { duration = 1, prefix = '', suffix = '' } = options;
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    return gsap.to({ value: start }, {
      value: end,
      duration,
      ease: 'power2.out',
      onUpdate: function() {
        el.textContent = prefix + Math.round(this.targets()[0].value) + suffix;
      }
    });
  }
};

// Global erişim
window.Transitions = Transitions;

export default Transitions;
