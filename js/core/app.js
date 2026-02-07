/**
 * APP.JS - Ana Uygulama Kontrolcüsü
 * Cyber-Nature Theme | Main Application Controller
 */

import AppState from './state.js';
import Transitions from './transitions.js';
import Helpers from '../utils/helpers.js';
import Haptic from '../utils/haptic.js';

const App = {
  /**
   * Uygulamayı başlat
   */
  async init() {
    console.log('🚀 Cyber-Nature App Initializing...');
    
    // Loading ekranını göster
    this.showLoading();
    
    // Küçük gecikme (font yüklenmesi için)
    await Helpers.delay(500);
    
    // Parçacık sistemini başlat
    this.initParticles();
    
    // İlerleme göstergesini kur
    this.setupProgressIndicator();
    
    // Intro ekranını göster
    await this.hideLoading();
    this.showIntro();
    
    // State değişikliklerini dinle
    this.setupStateListeners();
    
    console.log('✅ App Ready');
  },
  
  /**
   * Loading ekranını göster
   */
  showLoading() {
    const loading = Helpers.$('.loading-screen');
    if (loading) {
      loading.style.display = 'flex';
    }
  },
  
  /**
   * Loading ekranını gizle
   */
  async hideLoading() {
    const loading = Helpers.$('.loading-screen');
    if (loading) {
      await gsap.to(loading, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          loading.style.display = 'none';
        }
      });
    }
  },
  
  /**
   * Parçacık sistemini başlat
   */
  initParticles() {
    if (typeof Particles !== 'undefined' && AppState.settings.particlesEnabled) {
      Particles.init('particles-container');
    }
  },
  
  /**
   * İlerleme göstergesini kur
   */
  setupProgressIndicator() {
    const progressFill = Helpers.$('.top-progress-fill');
    const stageDots = Helpers.$$('.stage-dot');
    
    AppState.on('change', ({ key }) => {
      // İlerleme çubuğu
      if (progressFill) {
        progressFill.style.width = `${AppState.getProgress()}%`;
      }
      
      // Aşama noktaları
      if (key.includes('stages')) {
        this.updateStageDots(stageDots);
      }
    });
  },
  
  /**
   * Aşama noktalarını güncelle
   */
  updateStageDots(dots) {
    const stages = ['radar', 'orbit', 'constellation', 'camera'];
    
    dots.forEach((dot, index) => {
      const stageName = stages[index];
      if (!stageName) return;
      
      const stage = AppState.stages[stageName];
      
      dot.classList.remove('active', 'completed');
      
      if (stage.completed) {
        dot.classList.add('completed');
      } else if (AppState.currentScreen === `${stageName}-screen`) {
        dot.classList.add('active');
      }
    });
  },
  
  /**
   * Intro ekranını göster
   */
  showIntro() {
    const intro = Helpers.$('#intro-screen');
    if (!intro) return;
    
    intro.classList.add('active');
    
    // Elementleri animasyonla getir
    Transitions.animateIn('.intro-logo', { type: 'scale', delay: 0.2 });
    Transitions.animateIn('.intro-classification', { type: 'fadeUp', delay: 0.4 });
    Transitions.animateIn('.intro-title', { type: 'fadeUp', delay: 0.6 });
    Transitions.animateIn('.intro-subtitle', { type: 'fadeUp', delay: 0.8 });
    Transitions.animateIn('.intro-start-btn', { type: 'fadeUp', delay: 1 });
    
    // Başlat butonu
    const startBtn = Helpers.$('.intro-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startMission());
    }
  },
  
  /**
   * Görevi başlat
   */
  startMission() {
    Haptic.medium();
    
    Transitions.goto('intro-screen', 'radar-screen', {
      direction: 'left',
      onComplete: () => {
        if (window.RadarScreen) {
          window.RadarScreen.init();
        }
      }
    });
  },
  
  /**
   * State dinleyicilerini kur
   */
  setupStateListeners() {
    AppState.on('change:currentScreen', ({ newValue }) => {
      console.log(`📱 Screen changed to: ${newValue}`);
      
      // Aşama noktalarını güncelle
      const stageDots = Helpers.$$('.stage-dot');
      this.updateStageDots(stageDots);
    });
  },
  
  /**
   * Uygulamayı sıfırla
   */
  reset() {
    AppState.reset();
    
    // Tüm ekranları gizle
    Helpers.$$('.screen').forEach(screen => {
      screen.classList.remove('active');
      screen.style.opacity = '';
      screen.style.visibility = '';
      screen.style.transform = '';
    });
    
    // Intro'yu göster
    this.showIntro();
  }
};

// Global erişim
window.App = App;

export default App;
