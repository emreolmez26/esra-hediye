/**
 * CAMERA.JS - Aşama 4: Görsel Doğrulama (Camera HUD)
 * Cyber-Nature Theme | Iron Man / Terminator Style HUD
 * 
 * Ön kamera ile doğrulama ve final mesajı
 */

import AppState from '../core/state.js';
import Transitions from '../core/transitions.js';
import Haptic from '../utils/haptic.js';
import Helpers from '../utils/helpers.js';

const CameraScreen = {
  // Kamera stream
  stream: null,
  
  // HUD data interval
  dataInterval: null,
  
  // Doğrulama animasyonu aktif mi
  isVerifying: false,
  
  /**
   * Ekranı başlat
   */
  init() {
    this.bindElements();
    this.setupEventListeners();
    this.startHUDData();
    // Kamerayı otomatik başlatma - kullanıcı butona basmalı (iOS gereksinimi)
    this.showPermissionScreen();
  },
  
  /**
   * Permission ekranını göster
   */
  showPermissionScreen() {
    // Fallback'i gizle
    if (this.elements.fallback) {
      this.elements.fallback.classList.remove('visible');
    }
    // Video'yu gizle
    if (this.elements.video) {
      this.elements.video.style.display = 'none';
    }
    // Permission ekranını göster
    if (this.elements.permissionScreen) {
      this.elements.permissionScreen.style.display = 'flex';
    }
  },
  
  /**
   * DOM elementlerini bağla
   */
  bindElements() {
    this.elements = {
      screen: Helpers.$('#camera-screen'),
      wrapper: Helpers.$('.camera-wrapper'),
      video: Helpers.$('.camera-video'),
      fallback: Helpers.$('.camera-fallback'),
      verifyBtn: Helpers.$('.verify-button'),
      flashOverlay: Helpers.$('#flash-overlay'),
      successScreen: Helpers.$('.verification-success'),
      hudDataTL: Helpers.$('.hud-data-tl'),
      hudDataTR: Helpers.$('.hud-data-tr'),
      hudDataLeft: Helpers.$('.hud-data-left'),
      hudDataRight: Helpers.$('.hud-data-right'),
      statusFill: Helpers.$('.status-fill'),
      permissionScreen: Helpers.$('.camera-permission'),
      permissionBtn: Helpers.$('.camera-start-btn'),
      photoPreview: Helpers.$('.photo-preview'),
      photoCanvas: Helpers.$('.photo-canvas'),
      downloadBtn: Helpers.$('.photo-download-btn'),
      continueBtn: Helpers.$('.photo-continue-btn')
    };
  },
  
  /**
   * Event listener'ları kur
   */
  setupEventListeners() {
    if (this.elements.verifyBtn) {
      this.elements.verifyBtn.addEventListener('click', () => this.verify());
    }
    
    if (this.elements.permissionBtn) {
      this.elements.permissionBtn.addEventListener('click', () => this.initCamera());
    }
    
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.addEventListener('click', () => this.downloadPhoto());
    }
    
    if (this.elements.continueBtn) {
      this.elements.continueBtn.addEventListener('click', () => this.continueToSuccess());
    }
  },
  
  /**
   * Kamerayı başlat
   */
  async initCamera() {
    // Kamera desteği kontrolü
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.showFallback();
      return;
    }
    
    try {
      // iOS için constraints - basit tutuyoruz
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };
      
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      AppState.set('permissions.camera', true);
      
      if (this.elements.video) {
        this.elements.video.srcObject = this.stream;
        this.elements.video.setAttribute('autoplay', '');
        this.elements.video.setAttribute('playsinline', '');
        this.elements.video.setAttribute('muted', '');
        this.elements.video.style.display = 'block';
        
        // iOS için play promise
        try {
          await this.elements.video.play();
        } catch (playError) {
          console.log('Video play error:', playError);
        }
      }
      
      // Fallback'i gizle
      if (this.elements.fallback) {
        this.elements.fallback.classList.remove('visible');
      }
      
      // İzin ekranını gizle
      if (this.elements.permissionScreen) {
        this.elements.permissionScreen.style.display = 'none';
      }
      
      // Analiz animasyonunu başlat
      this.startAnalyzingAnimation();
      
    } catch (error) {
      console.error('Camera access denied:', error);
      this.showFallback();
    }
  },
  
  /**
   * Kamera yoksa fallback göster
   */
  showFallback() {
    if (this.elements.video) {
      this.elements.video.style.display = 'none';
    }
    if (this.elements.fallback) {
      this.elements.fallback.classList.add('visible');
    }
    if (this.elements.permissionScreen) {
      this.elements.permissionScreen.style.display = 'none';
    }
  },
  
  /**
   * Analiz animasyonu
   */
  startAnalyzingAnimation() {
    if (this.elements.statusFill) {
      this.elements.statusFill.classList.add('analyzing');
    }
  },
  
  /**
   * HUD verilerini başlat
   */
  startHUDData() {
    this.updateHUDData();
    this.dataInterval = setInterval(() => this.updateHUDData(), 500);
  },
  
  /**
   * HUD verilerini güncelle
   */
  updateHUDData() {
    // Sol üst
    if (this.elements.hudDataTL) {
      this.elements.hudDataTL.innerHTML = `
        <div class="data-row data-stream">SYS.STATUS: <span class="value">ACTIVE</span></div>
        <div class="data-row data-stream">CAM.FEED: <span class="value">ONLINE</span></div>
      `;
    }
    
    // Sağ üst
    if (this.elements.hudDataTR) {
      this.elements.hudDataTR.innerHTML = `
        <div class="data-row data-stream"><span class="value">${Helpers.getCurrentTime()}</span></div>
        <div class="data-row data-stream">REC <span class="value" style="color: #ff0055;">●</span></div>
      `;
    }
    
    // Sol
    if (this.elements.hudDataLeft) {
      this.elements.hudDataLeft.innerHTML = `
        <div class="data-row dim">SCAN.MODE</div>
        <div class="data-row">BIOMETRIC</div>
        <div class="data-row dim">CONF.LVL</div>
        <div class="data-row">${Helpers.randomInt(92, 99)}%</div>
        <div class="data-row dim">MATRIX</div>
        <div class="data-row">0x${Helpers.randomHex(4)}</div>
      `;
    }
    
    // Sağ
    if (this.elements.hudDataRight) {
      this.elements.hudDataRight.innerHTML = `
        <div class="data-row dim">RANGE</div>
        <div class="data-row">${Helpers.randomInt(10, 50)}cm</div>
        <div class="data-row dim">LIGHT</div>
        <div class="data-row">${Helpers.randomInt(60, 100)}%</div>
        <div class="data-row dim">FOCUS</div>
        <div class="data-row">LOCKED</div>
      `;
    }
  },
  
  /**
   * Doğrulama yap
   */
  async verify() {
    if (this.isVerifying) return;
    this.isVerifying = true;
    
    Haptic.heavy();
    
    // Fotoğrafı yakala
    this.capturePhoto();
    
    // Flash efekti
    await this.flashEffect();
    
    // Kısa bekleme
    await Helpers.delay(300);
    
    // Fotoğraf önizlemesini göster
    this.showPhotoPreview();
  },
  
  /**
   * Fotoğrafı yakala
   */
  capturePhoto() {
    if (!this.elements.video || !this.elements.photoCanvas) return;
    
    const video = this.elements.video;
    const canvas = this.elements.photoCanvas;
    const ctx = canvas.getContext('2d');
    
    // Canvas boyutunu video boyutuna ayarla
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Videoyu canvas'a çiz
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  },
  
  /**
   * Fotoğraf önizlemesini göster
   */
  showPhotoPreview() {
    if (this.elements.photoPreview) {
      this.elements.photoPreview.style.display = 'flex';
    }
    
    // HUD'ı gizle
    const hudOverlay = Helpers.$('.hud-overlay');
    if (hudOverlay) {
      hudOverlay.style.display = 'none';
    }
    
    // Kontrolları gizle
    const controls = Helpers.$('.camera-controls');
    if (controls) {
      controls.style.display = 'none';
    }
  },
  
  /**
   * Fotoğrafı indir
   */
  downloadPhoto() {
    if (!this.elements.photoCanvas) return;
    
    const link = document.createElement('a');
    link.download = 'cyber-nature-selfie.png';
    link.href = this.elements.photoCanvas.toDataURL('image/png');
    link.click();
    
    Haptic.medium();
  },
  
  /**
   * Başarı ekranına devam et
   */
  continueToSuccess() {
    // Önizlemeyi gizle
    if (this.elements.photoPreview) {
      this.elements.photoPreview.style.display = 'none';
    }
    
    // Başarı ekranını göster
    this.showSuccess();
  },
  
  /**
   * Flash efekti
   */
  flashEffect() {
    return new Promise(resolve => {
      if (this.elements.flashOverlay) {
        this.elements.flashOverlay.classList.add('flash');
        
        setTimeout(() => {
          this.elements.flashOverlay.classList.remove('flash');
          resolve();
        }, 500);
      } else {
        resolve();
      }
    });
  },
  
  /**
   * Başarı ekranını göster
   */
  async showSuccess() {
    AppState.set('stages.camera.completed', true);
    AppState.set('stages.camera.verified', true);
    
    // Data güncellemeyi durdur
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
    
    // Kamerayı durdur
    this.stopCamera();
    
    // Başarı ekranını göster
    if (this.elements.successScreen) {
      this.elements.successScreen.classList.add('show');
      
      // Checkmark animasyonu
      await Helpers.delay(300);
      const checkmark = this.elements.successScreen.querySelector('.success-checkmark');
      if (checkmark) {
        checkmark.classList.add('animate');
      }
    }
    
    Haptic.success();
    
    // Konfeti veya parçacık patlaması
    if (window.Particles) {
      window.Particles.burst();
    }
  },
  
  /**
   * Kamerayı durdur
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  },
  
  /**
   * Temizlik
   */
  destroy() {
    this.stopCamera();
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }
};

// Global erişim
window.CameraScreen = CameraScreen;

export default CameraScreen;
