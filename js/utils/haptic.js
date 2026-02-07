/**
 * HAPTIC.JS - Titreşim ve Dokunsal Geri Bildirim
 * Cyber-Nature Theme | Haptic Feedback Module
 */

import AppState from '../core/state.js';

const Haptic = {
  /**
   * Titreşim API desteği kontrolü
   */
  isSupported: 'vibrate' in navigator,
  
  /**
   * Hafif titreşim (dokunuş)
   */
  light() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate(10);
  },
  
  /**
   * Orta şiddetli titreşim (seçim)
   */
  medium() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate(25);
  },
  
  /**
   * Güçlü titreşim (başarı)
   */
  heavy() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate(50);
  },
  
  /**
   * Başarı deseni
   */
  success() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate([50, 50, 50, 50, 100]);
  },
  
  /**
   * Hata deseni
   */
  error() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate([100, 50, 100, 50, 100]);
  },
  
  /**
   * Uyarı deseni
   */
  warning() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate([30, 30, 30]);
  },
  
  /**
   * Kilit sesi titreşimi
   */
  lock() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate([20, 20, 40]);
  },
  
  /**
   * Radar ping titreşimi
   */
  ping() {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate([15, 30, 15]);
  },
  
  /**
   * Özel desen
   * @param {number[]} pattern - Titreşim deseni [vibrate, pause, vibrate, ...]
   */
  pattern(pattern) {
    if (!this.isSupported || !AppState.settings.vibrationEnabled) return;
    navigator.vibrate(pattern);
  },
  
  /**
   * Titreşimi durdur
   */
  stop() {
    if (!this.isSupported) return;
    navigator.vibrate(0);
  }
};

// Global erişim
window.Haptic = Haptic;

export default Haptic;
