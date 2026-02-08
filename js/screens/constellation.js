/**
 * CONSTELLATION.JS - Aşama 3: Çiçek Oluşturma
 * Cyber-Nature Theme | Petal Drag & Drop Module
 *
 * Kullanıcı yaprakları sürükleyip merkeze yerleştirir
 */

import AppState from "../core/state.js";
import Transitions from "../core/transitions.js";
import Haptic from "../utils/haptic.js";
import Helpers from "../utils/helpers.js";

const ConstellationScreen = {
  // Yaprak sayısı
  totalPetals: 6,
  placedPetals: 0,

  // Merkez hedef pozisyonu
  centerX: 0,
  centerY: 0,

  // Sürükleme durumu
  activePetal: null,
  isDragging: false,

  // Snap mesafesi
  snapDistance: 60,

  // Yaprak başlangıç pozisyonları
  petalStartPositions: [],

  /**
   * Ekranı başlat
   */
  init() {
    this.bindElements();
    this.calculateCenter();
    this.positionPetals();
    this.setupEventListeners();
    this.updateProgress();
  },

  /**
   * DOM elementlerini bağla
   */
  bindElements() {
    this.elements = {
      screen: Helpers.$("#constellation-screen"),
      builder: Helpers.$(".flower-builder"),
      centerTarget: Helpers.$(".flower-center-target"),
      petalsContainer: Helpers.$(".petals-container"),
      petals: Helpers.$$(".petal"),
      progressCount: Helpers.$(".progress-count"),
      instructions: Helpers.$(".constellation-instructions"),
      resetBtn: Helpers.$(".reset-button"),
    };
  },

  /**
   * Merkez pozisyonunu hesapla
   */
  calculateCenter() {
    if (this.elements.centerTarget) {
      const rect = this.elements.centerTarget.getBoundingClientRect();
      this.centerX = rect.left + rect.width / 2;
      this.centerY = rect.top + rect.height / 2;
    }
  },

  /**
   * Yaprakları rastgele pozisyonlara yerleştir
   */
  positionPetals() {
    const builder = this.elements.builder;
    if (!builder) return;

    const rect = builder.getBoundingClientRect();
    const positions = this.generatePetalPositions(rect);

    this.elements.petals.forEach((petal, i) => {
      const pos = positions[i];
      petal.style.left = `${pos.x}px`;
      petal.style.top = `${pos.y}px`;
      petal.style.transform = `rotate(${pos.rotation}deg)`;
      petal.dataset.placed = "false";
      petal.dataset.startX = pos.x;
      petal.dataset.startY = pos.y;
      petal.dataset.rotation = pos.rotation;

      this.petalStartPositions[i] = pos;
    });
  },

  /**
   * Yaprak pozisyonlarını oluştur (kenarlar ve köşeler)
   */
  generatePetalPositions(rect) {
    const padding = 30;
    const positions = [];

    // 6 yaprak için pozisyonlar (ekranın etrafına dağıtılmış)
    const spots = [
      { x: padding, y: rect.height * 0.2 }, // Sol üst
      { x: rect.width - padding - 50, y: rect.height * 0.15 }, // Sağ üst
      { x: padding, y: rect.height * 0.5 }, // Sol orta
      { x: rect.width - padding - 50, y: rect.height * 0.55 }, // Sağ orta
      { x: padding + 30, y: rect.height * 0.8 }, // Sol alt
      { x: rect.width - padding - 60, y: rect.height * 0.85 }, // Sağ alt
    ];

    spots.forEach((spot, i) => {
      positions.push({
        x: spot.x + Helpers.random(-10, 10),
        y: spot.y + Helpers.random(-10, 10),
        rotation: Helpers.random(-30, 30),
      });
    });

    return positions;
  },

  /**
   * Event listener'ları kur
   */
  setupEventListeners() {
    // Touch events
    this.elements.petals.forEach((petal) => {
      petal.addEventListener("touchstart", (e) => this.startDrag(e, petal), {
        passive: false,
      });
    });

    document.addEventListener("touchmove", (e) => this.drag(e), {
      passive: false,
    });
    document.addEventListener("touchend", (e) => this.endDrag(e));
    document.addEventListener("touchcancel", (e) => this.endDrag(e));

    // Mouse events
    this.elements.petals.forEach((petal) => {
      petal.addEventListener("mousedown", (e) => this.startDrag(e, petal));
    });

    document.addEventListener("mousemove", (e) => this.drag(e));
    document.addEventListener("mouseup", (e) => this.endDrag(e));

    // Reset button
    if (this.elements.resetBtn) {
      this.elements.resetBtn.addEventListener("click", () => this.reset());
    }
  },

  /**
   * Sürüklemeyi başlat
   */
  startDrag(e, petal) {
    if (petal.dataset.placed === "true") return;

    e.preventDefault();
    this.isDragging = true;
    this.activePetal = petal;

    petal.classList.add("dragging");
    Haptic.light();

    // Z-index'i artır
    petal.style.zIndex = "100";
  },

  /**
   * Sürükle
   */
  drag(e) {
    if (!this.isDragging || !this.activePetal) return;

    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const builder = this.elements.builder;
    const rect = builder.getBoundingClientRect();

    // Pozisyonu hesapla (builder'a göre relative)
    let x = touch.clientX - rect.left - 30;
    let y = touch.clientY - rect.top - 40;

    // Sınırları kontrol et
    x = Math.max(0, Math.min(rect.width - 60, x));
    y = Math.max(0, Math.min(rect.height - 80, y));

    this.activePetal.style.left = `${x}px`;
    this.activePetal.style.top = `${y}px`;

    // Merkeze yakınlık kontrolü
    const petalCenterX = rect.left + x + 30;
    const petalCenterY = rect.top + y + 40;

    this.calculateCenter();

    const distance = Math.sqrt(
      Math.pow(petalCenterX - this.centerX, 2) +
        Math.pow(petalCenterY - this.centerY, 2),
    );

    // Merkeze yakınsa vurgula
    if (distance < this.snapDistance * 1.5) {
      this.elements.centerTarget.classList.add("near");
    } else {
      this.elements.centerTarget.classList.remove("near");
    }
  },

  /**
   * Sürüklemeyi bitir
   */
  endDrag(e) {
    if (!this.isDragging || !this.activePetal) return;

    this.isDragging = false;
    this.activePetal.classList.remove("dragging");
    this.elements.centerTarget.classList.remove("near");

    // Merkeze snap olacak mı kontrol et
    const petal = this.activePetal;
    const builder = this.elements.builder;
    const rect = builder.getBoundingClientRect();

    const petalRect = petal.getBoundingClientRect();
    const petalCenterX = petalRect.left + petalRect.width / 2;
    const petalCenterY = petalRect.top + petalRect.height / 2;

    this.calculateCenter();

    const distance = Math.sqrt(
      Math.pow(petalCenterX - this.centerX, 2) +
        Math.pow(petalCenterY - this.centerY, 2),
    );

    if (distance < this.snapDistance) {
      // Yaprak merkeze yerleşti!
      this.placePetal(petal);
    } else {
      // Eski pozisyona dön
      petal.style.zIndex = "";
    }

    this.activePetal = null;
  },

  /**
   * Yaprağı merkeze yerleştir
   */
  placePetal(petal) {
    const index = parseInt(petal.dataset.index);
    petal.dataset.placed = "true";

    // Yaprak rotasyonunu hesapla (6 yaprak = 60 derece arayla)
    const rotation = index * 60;

    // Merkeze göre pozisyon
    const builder = this.elements.builder;
    const rect = builder.getBoundingClientRect();
    const centerTarget = this.elements.centerTarget;
    const targetRect = centerTarget.getBoundingClientRect();

    const centerX = targetRect.left - rect.left + targetRect.width / 2 - 30;
    const centerY = targetRect.top - rect.top + targetRect.height / 2 - 50;

    // Animasyonlu yerleştirme
    gsap.to(petal, {
      left: centerX,
      top: centerY,
      rotation: rotation,
      duration: 0.4,
      ease: "back.out(1.5)",
    });

    petal.classList.add("placed");
    petal.style.zIndex = 10 + index;

    Haptic.medium();

    this.placedPetals++;
    this.updateProgress();

    // Tamamlandı mı?
    if (this.placedPetals >= this.totalPetals) {
      this.onComplete();
    }
  },

  /**
   * Progress güncelle
   */
  updateProgress() {
    if (this.elements.progressCount) {
      this.elements.progressCount.textContent = this.placedPetals;
    }
  },

  /**
   * Sıfırla
   */
  reset() {
    this.placedPetals = 0;

    this.elements.petals.forEach((petal, i) => {
      const pos = this.petalStartPositions[i];
      if (pos) {
        gsap.to(petal, {
          left: pos.x,
          top: pos.y,
          rotation: pos.rotation,
          duration: 0.3,
        });
        petal.dataset.placed = "false";
        petal.classList.remove("placed");
        petal.style.zIndex = "";
      }
    });

    this.updateProgress();
    Haptic.light();
  },

  /**
   * Çiçek tamamlandı!
   */
  async onComplete() {
    AppState.set("stages.constellation.completed", true);
    Haptic.success();

    // Çiçek animasyonu
    await this.playFlowerAnimation();

    // Kolye reveal ekranını göster
    await this.showNecklaceReveal();

    // Sonraki aşamaya geç
    this.goToNextStage();
  },

  /**
   * Çiçek animasyonu
   */
  async playFlowerAnimation() {
    // Merkez parlaması
    gsap.to(this.elements.centerTarget, {
      scale: 1.3,
      boxShadow: "0 0 50px rgba(30, 144, 255, 0.8)",
      duration: 0.5,
    });

    // Yapraklar parlasın
    this.elements.petals.forEach((petal, i) => {
      gsap.to(petal, {
        filter: "drop-shadow(0 0 20px rgba(30, 144, 255, 0.8))",
        duration: 0.3,
        delay: i * 0.1,
      });
    });

    await Helpers.delay(1000);
  },

  /**
   * Kolye reveal ekranı
   */
  async showNecklaceReveal() {
    const overlay = document.createElement("div");
    overlay.className = "necklace-overlay";
    overlay.innerHTML = `
      <div class="necklace-content">
        <div class="necklace-title">SENİN İÇİN BİR SÜRPRİZ</div>
        <div class="necklace-image">
          <img src="assets/cicek.png" alt="Kolye">
        </div>
        <div class="necklace-message">
          Bu çiçeğin fiziksel hali seni bekliyor...
        </div>
        <div class="necklace-hint">
          İpucu: Reis'in cebine bak 💎
        </div>
        <button class="necklace-continue-btn">DEVAM ET</button>
      </div>
    `;
    document.body.appendChild(overlay);

    await Helpers.delay(100);
    overlay.classList.add("show");

    return new Promise((resolve) => {
      const btn = overlay.querySelector(".necklace-continue-btn");
      btn.addEventListener("click", () => {
        overlay.classList.remove("show");
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, 500);
      });
    });
  },

  /**
   * Sonraki aşamaya geç
   */
  goToNextStage() {
    Transitions.goto("constellation-screen", "camera-screen", {
      direction: "left",
      onComplete: () => {
        if (window.CameraScreen) {
          window.CameraScreen.init();
        }
      },
    });
  },

  /**
   * Temizlik
   */
  destroy() {
    this.placedPetals = 0;
    this.petalStartPositions = [];
  },
};

// Global erişim
window.ConstellationScreen = ConstellationScreen;

export default ConstellationScreen;
