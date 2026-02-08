/**
 * RADAR.JS - Aşama 1: Parmak İzi Tarama (Ajan Doğrulama)
 * Cyber-Nature Theme | Fingerprint Scanner Module
 *
 * Kullanıcı parmağını basılı tutarak kimliğini doğrular
 */

import AppState from "../core/state.js";
import Transitions from "../core/transitions.js";
import Haptic from "../utils/haptic.js";
import Helpers from "../utils/helpers.js";

const RadarScreen = {
  // Tarama durumu
  isScanning: false,
  progress: 0,
  scanDuration: 3000, // 3 saniye basılı tut

  // Animasyon
  animationId: null,
  startTime: null,

  // Data stream interval
  dataInterval: null,

  /**
   * Ekranı başlat
   */
  init() {
    this.bindElements();
    this.setupEventListeners();
    this.startDataStream();
    this.startPulseAnimation();
  },

  /**
   * DOM elementlerini bağla
   */
  bindElements() {
    this.elements = {
      screen: Helpers.$("#radar-screen"),
      wrapper: Helpers.$(".fingerprint-wrapper"),
      icon: Helpers.$(".fingerprint-icon"),
      progressRing: Helpers.$(".progress-ring-fill"),
      scanLine: Helpers.$(".scan-line"),
      statusText: Helpers.$(".fingerprint-status .status-text"),
      statusProgress: Helpers.$(".status-progress-fill"),
      instructions: Helpers.$(".radar-instructions"),
      dataTL: Helpers.$(".radar-data-tl"),
      dataTR: Helpers.$(".radar-data-tr"),
      dataBL: Helpers.$(".radar-data-bl"),
      dataBR: Helpers.$(".radar-data-br"),
    };
  },

  /**
   * Event listener'ları kur
   */
  setupEventListeners() {
    const wrapper = this.elements.wrapper;
    if (!wrapper) return;

    // Touch events
    wrapper.addEventListener("touchstart", (e) => this.startScan(e), {
      passive: false,
    });
    wrapper.addEventListener("touchend", (e) => this.stopScan(e));
    wrapper.addEventListener("touchcancel", (e) => this.stopScan(e));

    // Mouse events (desktop test için)
    wrapper.addEventListener("mousedown", (e) => this.startScan(e));
    wrapper.addEventListener("mouseup", (e) => this.stopScan(e));
    wrapper.addEventListener("mouseleave", (e) => this.stopScan(e));
  },

  /**
   * Pulse animasyonu başlat (bekleme durumu)
   */
  startPulseAnimation() {
    if (this.elements.wrapper) {
      this.elements.wrapper.classList.add("waiting");
    }
  },

  /**
   * Taramayı başlat
   */
  startScan(e) {
    if (e) e.preventDefault();
    if (AppState.stages.radar.locked) return;

    this.isScanning = true;
    this.startTime = performance.now();

    // Haptic feedback
    Haptic.light();

    // Görsel güncellemeler
    if (this.elements.wrapper) {
      this.elements.wrapper.classList.remove("waiting");
      this.elements.wrapper.classList.add("scanning");
    }

    if (this.elements.scanLine) {
      this.elements.scanLine.classList.add("active");
    }

    this.updateStatus("Dileğin kabul ediliyor...");

    // Animasyon döngüsünü başlat
    this.animateScan();
  },

  /**
   * Taramayı durdur
   */
  stopScan(e) {
    if (!this.isScanning) return;

    this.isScanning = false;

    // Animasyonu durdur
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Tamamlanmadıysa sıfırla
    if (this.progress < 100) {
      this.resetScan();
    }
  },

  /**
   * Tarama animasyonu
   */
  animateScan() {
    if (!this.isScanning) return;

    const elapsed = performance.now() - this.startTime;
    this.progress = Math.min(100, (elapsed / this.scanDuration) * 100);

    // Progress ring güncelle
    this.updateProgressRing(this.progress);

    // Status progress bar güncelle
    if (this.elements.statusProgress) {
      this.elements.statusProgress.style.width = `${this.progress}%`;
    }

    // Haptic feedback (aralıklarla)
    if (Math.floor(this.progress) % 25 === 0 && this.progress > 0) {
      Haptic.light();
    }

    // Tamamlandı mı?
    if (this.progress >= 100) {
      this.onScanComplete();
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animateScan());
  },

  /**
   * Progress ring güncelle
   */
  updateProgressRing(progress) {
    if (!this.elements.progressRing) return;

    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (progress / 100) * circumference;
    this.elements.progressRing.style.strokeDashoffset = offset;
  },

  /**
   * Taramayı sıfırla
   */
  resetScan() {
    this.progress = 0;

    // Görsel sıfırlama
    if (this.elements.wrapper) {
      this.elements.wrapper.classList.remove("scanning");
      this.elements.wrapper.classList.add("waiting");
    }

    if (this.elements.scanLine) {
      this.elements.scanLine.classList.remove("active");
    }

    this.updateProgressRing(0);

    if (this.elements.statusProgress) {
      this.elements.statusProgress.style.width = "0%";
    }

    this.updateStatus("Yıldıza dokunmaya devam et");
  },

  /**
   * Tarama tamamlandı!
   */
  async onScanComplete() {
    AppState.set("stages.radar.locked", true);
    AppState.set("stages.radar.completed", true);

    Haptic.success();

    // Görsel güncellemeler
    if (this.elements.wrapper) {
      this.elements.wrapper.classList.remove("scanning");
      this.elements.wrapper.classList.add("success");
    }

    if (this.elements.scanLine) {
      this.elements.scanLine.classList.remove("active");
    }

    this.updateStatus("Dileğin kabul edildi ✨");

    // Başarı animasyonu
    await this.playSuccessAnimation();

    // Sonraki aşamaya geç
    await Helpers.delay(1500);
    this.goToNextStage();
  },

  /**
   * Başarı animasyonu
   */
  async playSuccessAnimation() {
    // Icon parlasın
    if (this.elements.icon) {
      gsap.to(this.elements.icon, {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 2,
      });
    }

    // Wrapper glow
    if (this.elements.wrapper) {
      gsap.to(this.elements.wrapper, {
        boxShadow: "0 0 60px rgba(255, 215, 0, 0.8)",
        duration: 0.5,
      });
    }
  },

  /**
   * Status metnini güncelle
   */
  updateStatus(text) {
    if (this.elements.statusText) {
      this.elements.statusText.textContent = text;
    }
  },

  /**
   * Data stream başlat
   */
  startDataStream() {
    // Romantik tema için data stream'i devre dışı bırak
    // Köşe verileri artık kullanılmıyor
  },

  /**
   * Sonraki aşamaya geç
   */
  goToNextStage() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }

    Transitions.goto("radar-screen", "orbit-screen", {
      direction: "left",
      onComplete: () => {
        if (window.OrbitScreen) {
          window.OrbitScreen.init();
        }
      },
    });
  },

  /**
   * Temizlik
   */
  destroy() {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
};

// Global erişim
window.RadarScreen = RadarScreen;

export default RadarScreen;
