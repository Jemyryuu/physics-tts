// === STATE & KONFIGURASI ===
let currentAppMode = "questions"; // "questions" | "answers"
let currentFilter = "all";
let currentAnswerFilter = "all";
let answersSearchQuery = "";
let currentQuestionIndex = null;
let completedQuestions = new Set();

const TRANSITION_DURATION = 5;
const QUESTION_DURATION = 45;

let timerState = "IDLE";
let previousState = "IDLE";
let timeRemaining = QUESTION_DURATION;
let timerInterval = null;
let autoNextTimeout = null;
let soundEnabled = true;
let soundVolume = 0.8; // Nilai 0.0 - 1.0 (default 80%)

const SVG_ICONS = {
  mendatar: `<svg class="icon" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  menurun: `<svg class="icon" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  circle: `<svg class="icon" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`,
  pause: `<svg class="icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  play: `<svg class="icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  volumeHigh: `<svg class="icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
  volumeLow: `<svg class="icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
  volumeOff: `<svg class="icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
};

// === AUDIO SYNTHESIZER & VOLUME CONTROL ===
let audioCtx = null;
let volumeTestTimeout = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function setVolume(volume, isUserInput = false) {
  volume = Math.max(0, Math.min(1, volume));
  soundVolume = volume;
  
  if (volume === 0) {
    soundEnabled = false;
  } else {
    soundEnabled = true;
  }
  
  saveAudioSettings();
  updateVolumeUI();
  
  if (isUserInput && soundEnabled) {
    playVolumeTestTone();
  }
}

function playVolumeTestTone() {
  if (volumeTestTimeout) clearTimeout(volumeTestTimeout);
  volumeTestTimeout = setTimeout(() => {
    playBeep(587.33, "triangle", 0.12, 0.35);
  }, 100);
}

function toggleSoundMute() {
  if (soundEnabled && soundVolume > 0) {
    soundEnabled = false;
    showToast("Suara dimatikan (Mute)");
  } else {
    soundEnabled = true;
    if (soundVolume === 0) {
      soundVolume = 0.8;
    }
    showToast(`Suara diaktifkan (${Math.round(soundVolume * 100)}%)`);
    playVolumeTestTone();
  }
  saveAudioSettings();
  updateVolumeUI();
}

function updateVolumeUI() {
  const slider = document.getElementById("volumeSlider");
  const percentText = document.getElementById("volumePercent");
  const btnToggle = document.getElementById("btnToggleSound");
  
  const currentPercent = (soundEnabled && soundVolume > 0) ? Math.round(soundVolume * 100) : 0;
  
  if (slider) {
    slider.value = currentPercent;
  }
  if (percentText) {
    percentText.textContent = `${currentPercent}%`;
  }
  if (btnToggle) {
    let iconSvg = SVG_ICONS.volumeOff;
    if (soundEnabled && soundVolume > 0) {
      iconSvg = soundVolume > 0.5 ? SVG_ICONS.volumeHigh : SVG_ICONS.volumeLow;
    }
    btnToggle.innerHTML = iconSvg;
    btnToggle.title = (soundEnabled && soundVolume > 0) ? `Mute Suara (${currentPercent}%)` : "Unmute Suara";
  }
}

function playBeep(freq = 440, type = "sine", duration = 0.15, gainVal = 0.35) {
  if (!soundEnabled || soundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    const effectiveGain = Math.min(0.95, gainVal * soundVolume);
    gain.gain.setValueAtTime(effectiveGain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio play error", e);
  }
}

function playTransitionBeep() {
  playBeep(520, "sine", 0.08, 0.28);
}

function playStartChime() {
  if (!soundEnabled || soundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, "triangle", 0.25, 0.38);
      }, idx * 90);
    });
  } catch (e) {}
}

function playUrgentBeep() {
  playBeep(880, "square", 0.1, 0.28);
}

function playTimesUpBuzzer() {
  if (!soundEnabled || soundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    [300, 250, 200].forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, "sawtooth", 0.35, 0.45);
      }, idx * 130);
    });
  } catch (e) {}
}

// === PENYIMPANAN LOKAL ===
const STORAGE_KEY = "physics_tts_completed_v2";
const LEGACY_STORAGE_KEY = "physics_tts_completed_q";
const SOUND_SETTINGS_KEY = "physics_tts_sound_settings";

function loadCompletedQuestions() {
  try {
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    
    const validIds = new Set(QUESTIONS_DATA.map(q => q.id));
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        completedQuestions = new Set(parsed.filter(id => validIds.has(id)));
      }
    }
  } catch (e) {
    console.error(e);
    completedQuestions = new Set();
  }
}

function saveCompletedQuestions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedQuestions]));
  } catch (e) {
    console.error(e);
  }
}

function loadAudioSettings() {
  try {
    const saved = localStorage.getItem(SOUND_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.enabled === "boolean") soundEnabled = parsed.enabled;
      if (typeof parsed.volume === "number") soundVolume = Math.max(0, Math.min(1, parsed.volume));
    }
  } catch (e) {
    console.warn("Error loading audio settings", e);
  }
  updateVolumeUI();
}

function saveAudioSettings() {
  try {
    localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify({
      enabled: soundEnabled,
      volume: soundVolume
    }));
  } catch (e) {
    console.warn("Error saving audio settings", e);
  }
}

// === INISIALISASI & NAVIGASI MODE ===
document.addEventListener("DOMContentLoaded", () => {
  loadCompletedQuestions();
  loadAudioSettings();
  initModeNav();
  initQuestionTabs();
  initAnswerTabs();
  renderGrid();
  renderAnswersList();
  updateProgressStats();
  setupEventListeners();
});

const ANSWERS_PASSWORD = "FisikaHebat";

function initModeNav() {
  const btnQuestions = document.getElementById("navBtnQuestions");
  const btnAnswers = document.getElementById("navBtnAnswers");

  if (btnQuestions) {
    btnQuestions.addEventListener("click", () => switchAppMode("questions"));
  }
  if (btnAnswers) {
    btnAnswers.addEventListener("click", () => {
      if (currentAppMode === "answers") return;
      openPasswordModal();
    });
  }
}

function openPasswordModal() {
  const backdrop = document.getElementById("passwordModalBackdrop");
  const input = document.getElementById("passwordInput");
  const errorMsg = document.getElementById("passwordErrorMsg");
  const btnToggle = document.getElementById("btnTogglePasswordVisibility");
  
  if (errorMsg) errorMsg.style.display = "none";
  if (input) {
    input.value = "";
    input.classList.remove("input-error");
    input.type = "password";
  }
  if (btnToggle) {
    btnToggle.innerHTML = `<svg class="icon eye-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
  
  if (backdrop) {
    backdrop.classList.add("active");
    setTimeout(() => {
      if (input) input.focus();
    }, 60);
  }
}

function closePasswordModal() {
  const backdrop = document.getElementById("passwordModalBackdrop");
  if (backdrop) {
    backdrop.classList.remove("active");
  }
  const input = document.getElementById("passwordInput");
  if (input) {
    input.value = "";
  }
}

function togglePasswordVisibility() {
  const input = document.getElementById("passwordInput");
  const btn = document.getElementById("btnTogglePasswordVisibility");
  if (!input || !btn) return;

  if (input.type === "password") {
    input.type = "text";
    btn.innerHTML = `<svg class="icon eye-off-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  } else {
    input.type = "password";
    btn.innerHTML = `<svg class="icon eye-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
}

function verifyPassword() {
  const input = document.getElementById("passwordInput");
  const errorMsg = document.getElementById("passwordErrorMsg");
  if (!input) return;

  const entered = input.value.trim();
  if (entered === ANSWERS_PASSWORD) {
    closePasswordModal();
    switchAppMode("answers");
    showToast("Kunci jawaban berhasil dibuka");
  } else {
    if (errorMsg) {
      errorMsg.textContent = "Password salah! Silakan coba lagi.";
      errorMsg.style.display = "block";
    }
    input.classList.add("input-error");
    playBeep(220, "sawtooth", 0.2, 0.4);
    setTimeout(() => {
      input.classList.remove("input-error");
    }, 400);
    input.focus();
    input.select();
  }
}

function switchAppMode(mode) {
  currentAppMode = mode;
  const btnQuestions = document.getElementById("navBtnQuestions");
  const btnAnswers = document.getElementById("navBtnAnswers");
  const viewQuestions = document.getElementById("viewQuestions");
  const viewAnswers = document.getElementById("viewAnswers");

  if (mode === "questions") {
    if (btnQuestions) btnQuestions.classList.add("active");
    if (btnAnswers) btnAnswers.classList.remove("active");
    if (viewQuestions) {
      viewQuestions.style.display = "block";
      viewQuestions.classList.add("active");
    }
    if (viewAnswers) {
      viewAnswers.style.display = "none";
      viewAnswers.classList.remove("active");
    }
    renderGrid();
  } else {
    if (btnQuestions) btnQuestions.classList.remove("active");
    if (btnAnswers) btnAnswers.classList.add("active");
    if (viewQuestions) {
      viewQuestions.style.display = "none";
      viewQuestions.classList.remove("active");
    }
    if (viewAnswers) {
      viewAnswers.style.display = "block";
      viewAnswers.classList.add("active");
    }
    renderAnswersList();
  }
}

// === TAB FILTER SOAL ===
function initQuestionTabs() {
  const tabsContainer = document.getElementById("filterTabs");
  if (!tabsContainer) return;
  tabsContainer.innerHTML = "";

  ROUNDS_CONFIG.forEach(round => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${currentFilter === round.id ? "active" : ""}`;
    btn.textContent = `${round.label} (${round.range})`;
    btn.dataset.roundId = round.id;
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filterTabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = round.id;
      renderGrid();
    });
    tabsContainer.appendChild(btn);
  });
}

// === TAB FILTER KUNCI JAWABAN ===
function initAnswerTabs() {
  const tabsContainer = document.getElementById("answersFilterTabs");
  if (!tabsContainer) return;
  tabsContainer.innerHTML = "";

  ROUNDS_CONFIG.forEach(round => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${currentAnswerFilter === round.id ? "active" : ""}`;
    btn.textContent = `${round.label} (${round.range})`;
    btn.dataset.roundId = round.id;
    btn.addEventListener("click", () => {
      document.querySelectorAll("#answersFilterTabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentAnswerFilter = round.id;
      renderAnswersList();
    });
    tabsContainer.appendChild(btn);
  });

  const searchInput = document.getElementById("answersSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      answersSearchQuery = e.target.value.trim().toLowerCase();
      renderAnswersList();
    });
  }
}

// === GRID SOAL ===
function renderGrid() {
  const container = document.getElementById("questionsContainer");
  if (!container) return;
  container.innerHTML = "";

  let roundsToDisplay = [];
  if (currentFilter === "all") {
    roundsToDisplay = [
      { id: 1, name: "Ronde 1 (1 - 12)", range: [1, 12] },
      { id: 2, name: "Ronde 2 (1 - 12)", range: [1, 12] },
      { id: 3, name: "Ronde 3 (1 - 12)", range: [1, 12] },
      { id: 4, name: "Soal Cadangan (1 - 14)", range: [1, 14] }
    ];
  } else {
    const rId = parseInt(currentFilter, 10);
    const roundObj = ROUNDS_CONFIG.find(r => r.id === currentFilter);
    roundsToDisplay = [{
      id: rId,
      name: `${roundObj.label} (${roundObj.range})`,
      range: rId === 4 ? [1, 14] : [1, 12]
    }];
  }

  roundsToDisplay.forEach(round => {
    const roundSection = document.createElement("div");
    roundSection.className = "round-section";

    const questionsInRound = QUESTIONS_DATA.filter(q => q.round === round.id);
    const completedInRound = questionsInRound.filter(q => completedQuestions.has(q.id)).length;

    roundSection.innerHTML = `
      <div class="round-heading">
        <h2 class="round-title">${round.name}</h2>
        <span class="round-subtitle">${completedInRound} / ${questionsInRound.length} Selesai</span>
      </div>
      <div class="questions-grid" id="grid-round-${round.id}"></div>
    `;

    container.appendChild(roundSection);

    const grid = roundSection.querySelector(`#grid-round-${round.id}`);
    questionsInRound.forEach(q => {
      const isCompleted = completedQuestions.has(q.id);
      const isMendatar = q.type === "mendatar";

      const card = document.createElement("div");
      card.className = `question-card type-${q.type} ${isCompleted ? "is-completed" : ""}`;
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Soal nomor ${q.number} ${q.roundName}, ${q.direction}`);

      card.innerHTML = `
        ${isCompleted ? `<span class="card-completed-check">${SVG_ICONS.check}</span>` : ''}
        <div class="card-number">${q.number}</div>
        <div class="card-badge badge-${q.type}">
          ${isMendatar ? SVG_ICONS.mendatar : SVG_ICONS.menurun}
          <span>${isMendatar ? 'Mendatar' : 'Menurun'}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        openQuestionModal(q.id);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openQuestionModal(q.id);
        }
      });

      grid.appendChild(card);
    });
  });
}

// === DAFTAR KUNCI JAWABAN ===
function renderAnswersList() {
  const container = document.getElementById("answersContainer");
  if (!container) return;
  container.innerHTML = "";

  let roundsToDisplay = [];
  if (currentAnswerFilter === "all") {
    roundsToDisplay = [
      { id: 1, name: "Ronde 1 (1 - 12)" },
      { id: 2, name: "Ronde 2 (1 - 12)" },
      { id: 3, name: "Ronde 3 (1 - 12)" },
      { id: 4, name: "Soal Cadangan (1 - 14)" }
    ];
  } else {
    const rId = parseInt(currentAnswerFilter, 10);
    const roundObj = ROUNDS_CONFIG.find(r => r.id === currentAnswerFilter);
    roundsToDisplay = [{
      id: rId,
      name: `${roundObj.label} (${roundObj.range})`
    }];
  }

  let totalRendered = 0;

  roundsToDisplay.forEach(round => {
    let questionsInRound = QUESTIONS_DATA.filter(q => q.round === round.id);

    if (answersSearchQuery) {
      questionsInRound = questionsInRound.filter(q => 
        q.answer.toLowerCase().includes(answersSearchQuery) ||
        q.text.toLowerCase().includes(answersSearchQuery) ||
        String(q.number).includes(answersSearchQuery)
      );
    }

    if (questionsInRound.length === 0) return;

    totalRendered += questionsInRound.length;

    const roundSection = document.createElement("div");
    roundSection.className = "answer-round-section";

    roundSection.innerHTML = `
      <div class="round-heading">
        <h2 class="round-title">${round.name}</h2>
        <span class="round-subtitle">${questionsInRound.length} Kunci Jawaban</span>
      </div>
      <div class="answers-list-grid" id="answer-grid-${round.id}"></div>
    `;

    container.appendChild(roundSection);

    const grid = roundSection.querySelector(`#answer-grid-${round.id}`);
    questionsInRound.forEach(q => {
      const isMendatar = q.type === "mendatar";
      const card = document.createElement("div");
      card.className = `answer-card type-${q.type}`;

      card.innerHTML = `
        <div class="answer-card-header">
          <span class="answer-card-number">Nomor ${q.number}</span>
          <span class="card-badge badge-${q.type}">
            ${isMendatar ? SVG_ICONS.mendatar : SVG_ICONS.menurun}
            <span>${isMendatar ? 'Mendatar' : 'Menurun'}</span>
          </span>
        </div>
        <div class="answer-card-clue">${q.text}</div>
        <div class="answer-card-solution">
          <span class="solution-label">Kunci Jawaban</span>
          <span class="solution-value">${q.answer}</span>
        </div>
      `;

      grid.appendChild(card);
    });
  });

  if (totalRendered === 0) {
    container.innerHTML = `
      <div class="empty-answers-msg">
        <p>Tidak ada kunci jawaban yang cocok dengan pencarian "<strong>${answersSearchQuery}</strong>".</p>
      </div>
    `;
  }
}

function updateProgressStats() {
  const statsLabel = document.getElementById("progressStats");
  if (statsLabel) {
    statsLabel.textContent = `${completedQuestions.size} / ${QUESTIONS_DATA.length} Selesai`;
  }
}

// === MODAL SOAL (MURNI TANPA KUNCI JAWABAN) ===
function openQuestionModal(target) {
  let index = -1;
  if (typeof target === "number") {
    index = QUESTIONS_DATA.findIndex(q => q.globalNumber === target);
    if (index === -1 && target >= 0 && target < QUESTIONS_DATA.length) {
      index = target;
    }
  } else {
    index = QUESTIONS_DATA.findIndex(q => q.id === target);
  }

  if (index === -1) return;

  currentQuestionIndex = index;
  const q = QUESTIONS_DATA[index];

  document.getElementById("modalRoundTag").textContent = q.roundName || `Ronde ${q.round}`;
  document.getElementById("modalNumberTitle").textContent = `Nomor ${q.number}`;
  
  const dirPill = document.getElementById("modalDirectionPill");
  dirPill.className = `modal-direction-pill ${q.type}`;
  dirPill.innerHTML = `
    ${q.type === "mendatar" ? SVG_ICONS.mendatar : SVG_ICONS.menurun}
    <span>${q.type === "mendatar" ? "MENDATAR" : "MENURUN"}</span>
  `;

  updateModalCompletedBtn();
  updateModalNavButtons();

  const backdrop = document.getElementById("questionModalBackdrop");
  backdrop.classList.add("active");

  startTransitionTimer();
}

function markQuestionCompleted(questionId) {
  if (!completedQuestions.has(questionId)) {
    completedQuestions.add(questionId);
    saveCompletedQuestions();
    updateModalCompletedBtn();
    updateProgressStats();
  }
}

function isLastQuestionInRound(index) {
  if (index < 0 || index >= QUESTIONS_DATA.length) return false;
  if (index === QUESTIONS_DATA.length - 1) return true;
  return QUESTIONS_DATA[index].round !== QUESTIONS_DATA[index + 1].round;
}

function updateModalCompletedBtn() {
  if (currentQuestionIndex === null || !QUESTIONS_DATA[currentQuestionIndex]) return;
  const q = QUESTIONS_DATA[currentQuestionIndex];
  const isCompleted = completedQuestions.has(q.id);
  const btn = document.getElementById("btnToggleCompleted");

  if (isCompleted) {
    btn.innerHTML = `${SVG_ICONS.check} <span>Selesai</span>`;
    btn.classList.add("btn-primary");
  } else {
    btn.innerHTML = `${SVG_ICONS.circle} <span>Tandai Selesai</span>`;
    btn.classList.remove("btn-primary");
  }
}

function updateModalNavButtons() {
  const prevBtn = document.getElementById("btnPrevQuestion");
  const nextBtn = document.getElementById("btnNextQuestion");

  prevBtn.disabled = currentQuestionIndex <= 0;
  nextBtn.disabled = currentQuestionIndex >= QUESTIONS_DATA.length - 1;
}

function closeModal() {
  stopTimer();
  document.getElementById("questionModalBackdrop").classList.remove("active");
  renderGrid();
  updateProgressStats();
}

// === SISTEM TIMER & TRANSISI ===
function startTransitionTimer() {
  stopTimer();
  timerState = "TRANSITION";

  const transitionView = document.getElementById("transitionStateView");
  const clueView = document.getElementById("clueTextView");
  const countdownText = document.getElementById("transitionCountdownText");

  transitionView.classList.add("active");
  clueView.classList.remove("active");

  let transitionSec = TRANSITION_DURATION;
  countdownText.textContent = `Soal akan tampil dalam ${transitionSec} detik...`;
  updateTimerUI(transitionSec, TRANSITION_DURATION, "Fase Persiapan");
  playTransitionBeep();

  timerInterval = setInterval(() => {
    transitionSec--;
    if (transitionSec > 0) {
      countdownText.textContent = `Soal akan tampil dalam ${transitionSec} detik...`;
      updateTimerUI(transitionSec, TRANSITION_DURATION, "Fase Persiapan");
      playTransitionBeep();
    } else {
      clearInterval(timerInterval);
      startQuestionTimer();
    }
  }, 1000);
}

function startQuestionTimer(startFrom = QUESTION_DURATION) {
  stopTimer();
  timerState = "QUESTION";
  timeRemaining = startFrom;

  const q = QUESTIONS_DATA[currentQuestionIndex];
  const transitionView = document.getElementById("transitionStateView");
  const clueView = document.getElementById("clueTextView");

  transitionView.classList.remove("active");
  clueView.textContent = q.text;
  clueView.classList.add("active");

  updateTimerUI(timeRemaining, QUESTION_DURATION, "Waktu Menjawab");
  playStartChime();

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerUI(timeRemaining, QUESTION_DURATION, "Waktu Menjawab");

    if (timeRemaining <= 10 && timeRemaining > 0) {
      playUrgentBeep();
    }

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerState = "IDLE";
      playTimesUpBuzzer();
      updateTimerUI(0, QUESTION_DURATION, "WAKTU HABIS");

      const q = QUESTIONS_DATA[currentQuestionIndex];
      markQuestionCompleted(q.id);

      if (isLastQuestionInRound(currentQuestionIndex)) {
        showToast(`Waktu habis. Soal no. ${q.number} selesai! ${q.roundName} selesai!`);
        autoNextTimeout = setTimeout(() => {
          showRoundCompleteScreen(q.round);
        }, 1200);
      } else if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
        showToast(`Waktu habis. Soal no. ${q.number} selesai. Beralih ke soal berikutnya...`);
        autoNextTimeout = setTimeout(() => {
          openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].id);
        }, 1200);
      } else {
        showToast(`Waktu habis. Soal no. ${q.number} selesai. Seluruh soal telah selesai.`);
      }
    }
  }, 1000);
}

function pauseOrResumeTimer() {
  if (timerState === "QUESTION") {
    clearInterval(timerInterval);
    timerState = "PAUSED";
    previousState = "QUESTION";
    document.getElementById("timerStateLabel").textContent = "JEDA";
    document.getElementById("btnPauseResume").innerHTML = `${SVG_ICONS.play} <span>Lanjutkan</span>`;
  } else if (timerState === "TRANSITION") {
    clearInterval(timerInterval);
    timerState = "PAUSED";
    previousState = "TRANSITION";
    document.getElementById("timerStateLabel").textContent = "JEDA";
    document.getElementById("btnPauseResume").innerHTML = `${SVG_ICONS.play} <span>Lanjutkan</span>`;
  } else if (timerState === "PAUSED") {
    if (previousState === "QUESTION") {
      startQuestionTimer(timeRemaining);
    } else {
      startTransitionTimer();
    }
    document.getElementById("btnPauseResume").innerHTML = `${SVG_ICONS.pause} <span>Jeda</span>`;
  } else if (timerState === "IDLE") {
    startQuestionTimer(QUESTION_DURATION);
    document.getElementById("btnPauseResume").innerHTML = `${SVG_ICONS.pause} <span>Jeda</span>`;
  }
}

function resetTimer() {
  stopTimer();
  startTransitionTimer();
}

function skipTransition() {
  if (timerState === "TRANSITION" || (timerState === "PAUSED" && previousState === "TRANSITION")) {
    stopTimer();
    startQuestionTimer(QUESTION_DURATION);
  }
}

function skipQuestionTimer() {
  stopTimer();
  timerState = "IDLE";
  timeRemaining = 0;
  playTimesUpBuzzer();
  updateTimerUI(0, QUESTION_DURATION, "WAKTU HABIS");

  const q = QUESTIONS_DATA[currentQuestionIndex];
  markQuestionCompleted(q.id);

  if (isLastQuestionInRound(currentQuestionIndex)) {
    showToast(`Timer soal dilewati. Soal no. ${q.number} selesai! ${q.roundName} selesai!`);
    autoNextTimeout = setTimeout(() => {
      showRoundCompleteScreen(q.round);
    }, 800);
  } else if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
    showToast(`Timer soal dilewati. Soal no. ${q.number} selesai. Beralih ke soal berikutnya...`);
    autoNextTimeout = setTimeout(() => {
      openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].id);
    }, 800);
  } else {
    showToast(`Timer soal dilewati. Soal no. ${q.number} selesai. Seluruh soal telah selesai.`);
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (autoNextTimeout) {
    clearTimeout(autoNextTimeout);
    autoNextTimeout = null;
  }
  document.getElementById("btnPauseResume").innerHTML = `${SVG_ICONS.pause} <span>Jeda</span>`;
}

function updateTimerUI(seconds, totalDuration, labelText) {
  const timerNum = document.getElementById("timerNumber");
  const timerProgress = document.getElementById("timerProgressFill");
  const timerContainer = document.getElementById("timerDisplayContainer");
  const stateLabel = document.getElementById("timerStateLabel");

  timerNum.textContent = seconds;
  stateLabel.textContent = labelText;

  const percentage = Math.max(0, Math.min(100, (seconds / totalDuration) * 100));
  timerProgress.style.width = `${percentage}%`;

  timerContainer.classList.remove("timer-warning", "timer-danger");
  if (timerState === "QUESTION") {
    if (seconds <= 10 && seconds > 0) {
      timerContainer.classList.add("timer-danger");
    } else if (seconds <= 20) {
      timerContainer.classList.add("timer-warning");
    }
  }
}

// === SISTEM LAYAR RONDE SELESAI ===
function showRoundCompleteScreen(roundNumber) {
  closeModal();
  
  const roundConfig = ROUNDS_CONFIG.find(r => r.id === String(roundNumber));
  const roundName = roundConfig ? roundConfig.label : `Ronde ${roundNumber}`;
  const roundRange = roundConfig ? roundConfig.range : "";

  const questionsInRound = QUESTIONS_DATA.filter(q => q.round === roundNumber);
  const completedInRound = questionsInRound.filter(q => completedQuestions.has(q.id)).length;

  document.getElementById("roundCompleteBadge").textContent = `${roundName.toUpperCase()} SELESAI`;
  document.getElementById("statRoundCompleted").textContent = `${completedInRound}/${questionsInRound.length}`;
  document.getElementById("statTotalCompleted").textContent = `${completedQuestions.size}/${QUESTIONS_DATA.length}`;

  const btnContinue = document.getElementById("btnContinueNextRound");
  const btnContinueText = document.getElementById("btnContinueNextRoundText");

  if (roundNumber < 4) {
    const nextRoundNumber = roundNumber + 1;
    const nextRoundConfig = ROUNDS_CONFIG.find(r => r.id === String(nextRoundNumber));
    const nextRoundName = nextRoundConfig ? nextRoundConfig.label : `Ronde ${nextRoundNumber}`;
    const nextRoundRange = nextRoundConfig ? nextRoundConfig.range : "";
    const nextFirstQuestion = QUESTIONS_DATA.find(q => q.round === nextRoundNumber);

    document.getElementById("roundCompleteTitle").textContent = `Selamat! ${roundName} Selesai`;
    document.getElementById("roundCompleteDesc").textContent = `Seluruh nomor pada ${roundName} (${roundRange}) telah selesai. Siap melanjutkan ke ${nextRoundName}?`;
    
    btnContinueText.textContent = `Lanjut ke ${nextRoundName} (${nextRoundRange})`;
    btnContinue.style.display = "inline-flex";

    btnContinue.onclick = () => {
      closeRoundCompleteModal();
      if (currentFilter === String(roundNumber)) {
        currentFilter = String(nextRoundNumber);
        const tabs = document.querySelectorAll("#filterTabs .tab-btn");
        tabs.forEach(tab => {
          if (tab.dataset.roundId === String(nextRoundNumber)) {
            tab.classList.add("active");
          } else {
            tab.classList.remove("active");
          }
        });
        renderGrid();
      }
      if (nextFirstQuestion) {
        openQuestionModal(nextFirstQuestion.id);
      }
    };
  } else {
    document.getElementById("roundCompleteTitle").textContent = "Luar Biasa! Semua Ronde Selesai";
    document.getElementById("roundCompleteDesc").textContent = "50 Soal TTS Fluida & Mekanika Fisika telah rampung diselesaikan.";
    
    btnContinueText.textContent = "Ulangi dari Ronde 1 (1 - 12)";
    btnContinue.style.display = "inline-flex";

    btnContinue.onclick = () => {
      closeRoundCompleteModal();
      openQuestionModal(QUESTIONS_DATA[0].id);
    };
  }

  playCelebrationChime();
  document.getElementById("roundCompleteModalBackdrop").classList.add("active");
}

function closeRoundCompleteModal() {
  document.getElementById("roundCompleteModalBackdrop").classList.remove("active");
  renderGrid();
  updateProgressStats();
}

function playCelebrationChime() {
  if (!soundEnabled || soundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => {
        playBeep(freq, "triangle", 0.35, 0.4);
      }, idx * 110);
    });
  } catch (e) {}
}

// === EVENT LISTENERS & SHORTCUTS ===
function setupEventListeners() {
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("btnBackToGrid").addEventListener("click", closeModal);

  document.getElementById("questionModalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "questionModalBackdrop") {
      closeModal();
    }
  });

  document.getElementById("roundCompleteModalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "roundCompleteModalBackdrop") {
      closeRoundCompleteModal();
    }
  });
  document.getElementById("btnRoundCompleteBackToGrid").addEventListener("click", closeRoundCompleteModal);

  document.getElementById("btnPauseResume").addEventListener("click", pauseOrResumeTimer);
  document.getElementById("btnResetTimer").addEventListener("click", resetTimer);
  document.getElementById("btnSkipTransition").addEventListener("click", skipTransition);
  
  const btnSkipQ = document.getElementById("btnSkipQuestionTimer");
  if (btnSkipQ) {
    btnSkipQ.addEventListener("click", skipQuestionTimer);
  }

  document.getElementById("btnPrevQuestion").addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      openQuestionModal(QUESTIONS_DATA[currentQuestionIndex - 1].id);
    }
  });

  document.getElementById("btnNextQuestion").addEventListener("click", () => {
    const q = QUESTIONS_DATA[currentQuestionIndex];
    if (q && isLastQuestionInRound(currentQuestionIndex)) {
      showRoundCompleteScreen(q.round);
    } else if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
      openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].id);
    }
  });

  document.getElementById("btnToggleCompleted").addEventListener("click", () => {
    if (currentQuestionIndex === null || !QUESTIONS_DATA[currentQuestionIndex]) return;
    const q = QUESTIONS_DATA[currentQuestionIndex];
    if (completedQuestions.has(q.id)) {
      completedQuestions.delete(q.id);
      showToast(`Soal Nomor ${q.number} (${q.roundName}) ditandai belum selesai`);
      saveCompletedQuestions();
      updateModalCompletedBtn();
      updateProgressStats();
    } else {
      completedQuestions.add(q.id);
      saveCompletedQuestions();
      updateModalCompletedBtn();
      updateProgressStats();

      // Otomatis lanjut ke soal berikutnya atau layar ronde selesai
      if (isLastQuestionInRound(currentQuestionIndex)) {
        showToast(`Soal Nomor ${q.number} selesai! ${q.roundName} selesai!`);
        stopTimer();
        autoNextTimeout = setTimeout(() => {
          showRoundCompleteScreen(q.round);
        }, 500);
      } else if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
        showToast(`Soal Nomor ${q.number} selesai. Melanjutkan ke soal berikutnya...`);
        stopTimer();
        autoNextTimeout = setTimeout(() => {
          openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].id);
        }, 500);
      } else {
        showToast(`Soal Nomor ${q.number} selesai. Seluruh soal telah selesai.`);
      }
    }
  });

  document.getElementById("btnResetAllProgress").addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin mereset semua status soal yang telah selesai?")) {
      completedQuestions.clear();
      saveCompletedQuestions();
      renderGrid();
      updateProgressStats();
      showToast("Semua progress soal telah direset.");
    }
  });

  const btnToggleSound = document.getElementById("btnToggleSound");
  if (btnToggleSound) {
    btnToggleSound.addEventListener("click", toggleSoundMute);
  }

  const volumeSlider = document.getElementById("volumeSlider");
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      setVolume(val / 100, true);
    });
  }

  document.getElementById("btnFullscreen").addEventListener("click", toggleFullscreen);

  // Password Modal Events
  const btnCancelPassword = document.getElementById("btnCancelPassword");
  if (btnCancelPassword) {
    btnCancelPassword.addEventListener("click", closePasswordModal);
  }

  const passwordForm = document.getElementById("passwordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      verifyPassword();
    });
  }

  const btnTogglePwd = document.getElementById("btnTogglePasswordVisibility");
  if (btnTogglePwd) {
    btnTogglePwd.addEventListener("click", togglePasswordVisibility);
  }

  const pwdBackdrop = document.getElementById("passwordModalBackdrop");
  if (pwdBackdrop) {
    pwdBackdrop.addEventListener("click", (e) => {
      if (e.target === pwdBackdrop) {
        closePasswordModal();
      }
    });
  }

  document.addEventListener("keydown", handleKeydown);
}

function handleKeydown(e) {
  const isPasswordOpen = document.getElementById("passwordModalBackdrop")?.classList.contains("active");
  const isModalOpen = document.getElementById("questionModalBackdrop").classList.contains("active");
  const isRoundCompleteOpen = document.getElementById("roundCompleteModalBackdrop").classList.contains("active");

  if (e.key === "Escape") {
    if (isPasswordOpen) {
      closePasswordModal();
      return;
    }
    if (isModalOpen) {
      closeModal();
      return;
    }
    if (isRoundCompleteOpen) {
      closeRoundCompleteModal();
      return;
    }
  }

  // Jika sedang mengetik di input, jangan jalankan shortcut keyboard global
  if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
    return;
  }

  if (e.key === "m" || e.key === "M") {
    toggleSoundMute();
    return;
  }

  if (isModalOpen) {
    if (e.code === "Space") {
      e.preventDefault();
      pauseOrResumeTimer();
    } else if (e.key === "r" || e.key === "R") {
      resetTimer();
    } else if (e.key === "s" || e.key === "S") {
      skipTransition();
    } else if (e.key === "t" || e.key === "T" || e.key === "k" || e.key === "K") {
      skipQuestionTimer();
    } else if (e.key === "ArrowLeft") {
      if (currentQuestionIndex > 0) {
        openQuestionModal(QUESTIONS_DATA[currentQuestionIndex - 1].id);
      }
    } else if (e.key === "ArrowRight") {
      const q = QUESTIONS_DATA[currentQuestionIndex];
      if (q && isLastQuestionInRound(currentQuestionIndex)) {
        showRoundCompleteScreen(q.round);
      } else if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
        openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].id);
      }
    }
  }
}

// === NOTIFIKASI & LAYAR PENUH ===
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen request error", err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
