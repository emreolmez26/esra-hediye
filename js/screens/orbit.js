/**
 * ORBIT.JS - Aşama 2: Güvenlik Sorusu Ekranı
 * Cyber-Nature Theme | Question Answer Module
 *
 * Kullanıcı doğru cevabı girerek kilidi açar
 */

import AppState from "../core/state.js";
import Transitions from "../core/transitions.js";
import Haptic from "../utils/haptic.js";
import Helpers from "../utils/helpers.js";

const OrbitScreen = {
  // Doğru cevap (küçük harfe çevrilecek)
  correctAnswer: "chill",

  // Deneme sayısı
  attempts: 0,

  /**
   * Ekranı başlat
   */
  init() {
    this.bindElements();
    this.setupEventListeners();
    this.focusInput();
  },

  /**
   * DOM elementlerini bağla
   */
  bindElements() {
    this.elements = {
      screen: Helpers.$("#orbit-screen"),
      questionBox: Helpers.$(".question-box"),
      answerInput: Helpers.$(".answer-input"),
      submitBtn: Helpers.$(".answer-submit"),
      feedback: Helpers.$(".answer-feedback"),
      status: Helpers.$(".orbit-status"),
    };
  },

  /**
   * Event listener'ları kur
   */
  setupEventListeners() {
    if (this.elements.submitBtn) {
      this.elements.submitBtn.addEventListener("click", () =>
        this.checkAnswer(),
      );
    }

    if (this.elements.answerInput) {
      this.elements.answerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.checkAnswer();
        }
      });

      // Input efekti
      this.elements.answerInput.addEventListener("input", () => {
        this.clearFeedback();
      });
    }
  },

  /**
   * Input'a focus
   */
  focusInput() {
    setTimeout(() => {
      if (this.elements.answerInput) {
        this.elements.answerInput.focus();
      }
    }, 500);
  },

  /**
   * Cevabı kontrol et
   */
  checkAnswer() {
    const input = this.elements.answerInput;
    if (!input) return;

    const answer = input.value.trim().toLowerCase();

    if (!answer) {
      this.showFeedback("Bir cevap gir!", "error");
      Haptic.light();
      return;
    }

    this.attempts++;

    if (answer === this.correctAnswer) {
      // Doğru cevap!
      this.onCorrectAnswer();
    } else {
      // Yanlış cevap
      this.onWrongAnswer();
    }
  },

  /**
   * Doğru cevap
   */
  async onCorrectAnswer() {
    Haptic.success();

    // Input'u devre dışı bırak
    if (this.elements.answerInput) {
      this.elements.answerInput.disabled = true;
      this.elements.answerInput.classList.add("correct");
    }

    // Feedback göster
    this.showFeedback("DOĞRU! ✓", "success");

    // Status güncelle
    if (this.elements.status) {
      this.elements.status.textContent = "KİLİT AÇILDI";
      this.elements.status.classList.add("success");
    }

    // Question box efekti
    if (this.elements.questionBox) {
      this.elements.questionBox.classList.add("unlocked");
    }

    // State güncelle
    AppState.set("stages.orbit.completed", true);

    // Bekle ve sonraki aşamaya geç
    await Helpers.delay(2000);
    this.goToNextStage();
  },

  /**
   * Yanlış cevap
   */
  onWrongAnswer() {
    Haptic.heavy();

    // Shake efekti
    if (this.elements.answerInput) {
      this.elements.answerInput.classList.add("shake");
      setTimeout(() => {
        this.elements.answerInput.classList.remove("shake");
      }, 500);
    }

    // Feedback göster
    this.showFeedback("Yanlış! Tekrar dene...", "error");

    // Input'u temizle
    setTimeout(() => {
      if (this.elements.answerInput) {
        this.elements.answerInput.value = "";
        this.elements.answerInput.focus();
      }
    }, 800);
  },

  /**
   * Feedback göster
   */
  showFeedback(text, type) {
    if (this.elements.feedback) {
      this.elements.feedback.textContent = text;
      this.elements.feedback.className = "answer-feedback " + type;
      this.elements.feedback.classList.add("visible");
    }
  },

  /**
   * Feedback temizle
   */
  clearFeedback() {
    if (this.elements.feedback) {
      this.elements.feedback.classList.remove("visible");
    }
  },

  /**
   * Sonraki aşamaya geç
   */
  goToNextStage() {
    Transitions.goto("orbit-screen", "constellation-screen", {
      direction: "left",
      onComplete: () => {
        if (window.ConstellationScreen) {
          window.ConstellationScreen.init();
        }
      },
    });
  },

  /**
   * Temizlik
   */
  destroy() {
    // Cleanup if needed
  },
};

// Global erişim
window.OrbitScreen = OrbitScreen;

export default OrbitScreen;
