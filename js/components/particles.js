/**
 * PARTICLES.JS - Three.js Parçacık Sistemi
 * Cyber-Nature Theme | Background Particle Effects
 */

import AppState from "../core/state.js";

const Particles = {
  scene: null,
  camera: null,
  renderer: null,
  particles: null,
  animationId: null,

  /**
   * Parçacık sistemini başlat
   * @param {string} containerId - Container element ID
   */
  init(containerId = "particles-container") {
    if (!AppState.settings.particlesEnabled) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Three.js kontrolü
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded, skipping particles");
      return;
    }

    // Scene oluştur
    this.scene = new THREE.Scene();

    // Camera oluştur
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 50;

    // Renderer oluştur
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Parçacıkları oluştur
    this.createParticles();

    // Resize event
    window.addEventListener("resize", () => this.onResize());

    // Animasyonu başlat
    this.animate();
  },

  /**
   * Parçacıkları oluştur
   */
  createParticles() {
    const particleCount = window.innerWidth < 768 ? 100 : 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100; // x
      positions[i + 1] = (Math.random() - 0.5) * 100; // y
      positions[i + 2] = (Math.random() - 0.5) * 50; // z

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.01;

      sizes[i / 3] = Math.random() * 0.5 + 0.3;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.userData.velocities = velocities;

    // Yıldız texture'ı oluştur
    const starTexture = this.createStarTexture();

    // Parçacık materyali - Gerçek yıldız görünümü
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      map: starTexture,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Bağlantı çizgileri için (opsiyonel)
    this.createConnections();
  },

  /**
   * Yıldız şeklinde texture oluştur
   */
  createStarTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    const centerX = 32;
    const centerY = 32;

    // Radial gradient ile parlak merkez
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      32,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.2, "rgba(255, 255, 200, 0.5)");
    gradient.addColorStop(0.4, "rgba(255, 220, 150, 0.2)");
    gradient.addColorStop(1, "rgba(255, 200, 100, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    // 4 köşeli yıldız ışınları
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;

    // Yatay ışın
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(64, centerY);
    ctx.stroke();

    // Dikey ışın
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, 64);
    ctx.stroke();

    // Çapraz ışınlar (daha ince)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(56, 56);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(56, 8);
    ctx.lineTo(8, 56);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  },

  /**
   * Parçacıklar arası bağlantı çizgileri
   */
  createConnections() {
    // Performans için mobilde devre dışı
    if (window.innerWidth < 768) return;

    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });

    this.connections = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.connections);
  },

  /**
   * Animasyon döngüsü
   */
  animate() {
    if (!this.particles) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    const positions = this.particles.geometry.attributes.position.array;
    const velocities = this.particles.geometry.userData.velocities;

    for (let i = 0; i < positions.length; i += 3) {
      // Pozisyonu güncelle
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Sınırları kontrol et
      if (Math.abs(positions[i]) > 50) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 50) velocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 25) velocities[i + 2] *= -1;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    // Hafif dönüş
    this.particles.rotation.y += 0.0002;
    this.particles.rotation.x += 0.0001;

    // Render
    this.renderer.render(this.scene, this.camera);
  },

  /**
   * Pencere boyut değişikliği
   */
  onResize() {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  /**
   * Parçacık rengini değiştir
   * @param {number} color - Hex renk
   */
  setColor(color) {
    if (!this.particles) return;
    this.particles.material.color.setHex(color);
  },

  /**
   * Parçacık yoğunluğunu artır
   */
  burst() {
    if (!this.particles) return;

    const velocities = this.particles.geometry.userData.velocities;
    for (let i = 0; i < velocities.length; i++) {
      velocities[i] *= 3;
    }

    // 1 saniye sonra normale dön
    setTimeout(() => {
      for (let i = 0; i < velocities.length; i++) {
        velocities[i] /= 3;
      }
    }, 1000);
  },

  /**
   * Parçacıkları durdur
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  /**
   * Parçacıkları temizle
   */
  destroy() {
    this.stop();

    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }

    if (this.connections) {
      this.scene.remove(this.connections);
      this.connections.geometry.dispose();
      this.connections.material.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  },
};

// Global erişim
window.Particles = Particles;

export default Particles;
