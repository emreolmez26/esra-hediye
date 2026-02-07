/**
 * MAIN.JS - Entry Point
 * Cyber-Nature Theme | Application Bootstrap
 * 
 * Tüm modülleri yükler ve uygulamayı başlatır
 */

// Core modüller
import AppState from './core/state.js';
import App from './core/app.js';
import Transitions from './core/transitions.js';

// Yardımcı modüller
import Helpers from './utils/helpers.js';
import Haptic from './utils/haptic.js';

// Bileşenler
import Particles from './components/particles.js';

// Ekran modülleri
import RadarScreen from './screens/radar.js';
import OrbitScreen from './screens/orbit.js';
import ConstellationScreen from './screens/constellation.js';
import CameraScreen from './screens/camera.js';

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
  // GSAP kontrolü
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded!');
    return;
  }
  
  // Uygulamayı başlat
  App.init();
});

// Sayfa kapandığında temizlik
window.addEventListener('beforeunload', () => {
  // Kamerayı kapat
  if (window.CameraScreen) {
    CameraScreen.destroy();
  }
  
  // Parçacıkları durdur
  if (window.Particles) {
    Particles.destroy();
  }
});

// Service Worker (Opsiyonel - PWA için)
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js');
// }
