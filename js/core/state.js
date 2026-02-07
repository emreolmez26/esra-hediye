/**
 * STATE.JS - Merkezi Durum Yönetimi
 * Cyber-Nature Theme | State Management Module
 * 
 * Uygulama genelinde kullanılan tüm durumları yönetir
 */

const AppState = {
  // Mevcut ekran/aşama
  currentScreen: 'intro', // intro, radar, orbit, constellation, camera, success
  
  // Aşama tamamlanma durumları
  stages: {
    radar: { completed: false, locked: false },
    orbit: { completed: false, lockedRings: 0 },
    constellation: { completed: false, connectedNodes: 0 },
    camera: { completed: false, verified: false }
  },
  
  // Cihaz izinleri
  permissions: {
    gyroscope: false,
    camera: false
  },
  
  // Cihaz sensör verileri
  sensors: {
    alpha: 0,
    beta: 0,
    gamma: 0
  },
  
  // Oyun ayarları
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    particlesEnabled: true
  },
  
  // Event listeners listesi
  listeners: {},
  
  /**
   * Durumu güncelle ve olayları tetikle
   * @param {string} key - Güncellenecek durum anahtarı
   * @param {any} value - Yeni değer
   */
  set(key, value) {
    const keys = key.split('.');
    let current = this;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    const oldValue = current[lastKey];
    current[lastKey] = value;
    
    // Değişiklik olayını tetikle
    this.emit('change', { key, oldValue, newValue: value });
    this.emit(`change:${key}`, { oldValue, newValue: value });
  },
  
  /**
   * Durumu oku
   * @param {string} key - Okunacak durum anahtarı
   * @returns {any}
   */
  get(key) {
    const keys = key.split('.');
    let current = this;
    
    for (const k of keys) {
      if (current === undefined) return undefined;
      current = current[k];
    }
    
    return current;
  },
  
  /**
   * Olay dinleyici ekle
   * @param {string} event - Olay adı
   * @param {Function} callback - Çağrılacak fonksiyon
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  
  /**
   * Olay dinleyici kaldır
   * @param {string} event - Olay adı
   * @param {Function} callback - Kaldırılacak fonksiyon
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  },
  
  /**
   * Olay tetikle
   * @param {string} event - Olay adı
   * @param {any} data - Olay verisi
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  },
  
  /**
   * Tüm durumları sıfırla
   */
  reset() {
    this.currentScreen = 'intro';
    this.stages = {
      radar: { completed: false, locked: false },
      orbit: { completed: false, lockedRings: 0 },
      constellation: { completed: false, connectedNodes: 0 },
      camera: { completed: false, verified: false }
    };
    this.emit('reset');
  },
  
  /**
   * İlerleme yüzdesini hesapla
   * @returns {number} 0-100 arası ilerleme
   */
  getProgress() {
    let completed = 0;
    if (this.stages.radar.completed) completed++;
    if (this.stages.orbit.completed) completed++;
    if (this.stages.constellation.completed) completed++;
    if (this.stages.camera.completed) completed++;
    return (completed / 4) * 100;
  }
};

// Global erişim için
window.AppState = AppState;

export default AppState;
