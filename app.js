// === STATE & KONFIGURASI ===
let currentFilter = "all";
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
const STORAGE_KEY = "physics_tts_completed_q";
const SOUND_SETTINGS_KEY = "physics_tts_sound_settings";

function loadCompletedQuestions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      completedQuestions = new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.error(e);
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

// === INISIALISASI & TAB FILTER ===
document.addEventListener("DOMContentLoaded", () => {
  loadCompletedQuestions();
  loadAudioSettings();
  initTabs();
  renderGrid();
  updateProgressStats();
  setupEventListeners();
});

function initTabs() {
  const tabsContainer = document.getElementById("filterTabs");
  tabsContainer.innerHTML = "";

  ROUNDS_CONFIG.forEach(round => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${currentFilter === round.id ? "active" : ""}`;
    btn.textContent = `${round.label} (${round.range})`;
    btn.dataset.roundId = round.id;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = round.id;
      renderGrid();
    });
    tabsContainer.appendChild(btn);
  });
}

// === GRID SOAL ===
function renderGrid() {
  const container = document.getElementById("questionsContainer");
  container.innerHTML = "";

  let roundsToDisplay = [];
  if (currentFilter === "all") {
    roundsToDisplay = [
      { id: 1, name: "Ronde 1 (1–12)", range: [1, 12] },
      { id: 2, name: "Ronde 2 (13–24)", range: [13, 24] },
      { id: 3, name: "Ronde 3 (25–36)", range: [25, 36] },
      { id: 4, name: "Sisa Nomor (37–50)", range: [37, 50] }
    ];
  } else {
    const rId = parseInt(currentFilter, 10);
    const roundObj = ROUNDS_CONFIG.find(r => r.id === currentFilter);
    roundsToDisplay = [{
      id: rId,
      name: `${roundObj.label} (${roundObj.range})`,
      range: rId === 1 ? [1, 12] : rId === 2 ? [13, 24] : rId === 3 ? [25, 36] : [37, 50]
    }];
  }

  roundsToDisplay.forEach(round => {
    const roundSection = document.createElement("div");
    roundSection.className = "round-section";

    const questionsInRound = QUESTIONS_DATA.filter(q => q.round === round.id);
    const completedInRound = questionsInRound.filter(q => completedQuestions.has(q.number)).length;

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
      const isCompleted = completedQuestions.has(q.number);
      const isMendatar = q.type === "mendatar";

      const card = document.createElement("div");
      card.className = `question-card type-${q.type} ${isCompleted ? "is-completed" : ""}`;
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Soal nomor ${q.number}, ${q.direction}`);

      card.innerHTML = `
        ${isCompleted ? `<span class="card-completed-check">${SVG_ICONS.check}</span>` : ''}
        <div class="card-number">${q.number}</div>
        <div class="card-badge badge-${q.type}">
          ${isMendatar ? SVG_ICONS.mendatar : SVG_ICONS.menurun}
          <span>${isMendatar ? 'Mendatar' : 'Menurun'}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        openQuestionModal(q.number);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openQuestionModal(q.number);
        }
      });

      grid.appendChild(card);
    });
  });
}

function updateProgressStats() {
  const statsLabel = document.getElementById("progressStats");
  if (statsLabel) {
    statsLabel.textContent = `${completedQuestions.size} / 50 Selesai`;
  }
}

// === MODAL SOAL ===
function openQuestionModal(questionNumber) {
  const index = QUESTIONS_DATA.findIndex(q => q.number === questionNumber);
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

function updateModalCompletedBtn() {
  const q = QUESTIONS_DATA[currentQuestionIndex];
  const isCompleted = completedQuestions.has(q.number);
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

      if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
        showToast("Waktu habis. Beralih ke soal berikutnya...");
        autoNextTimeout = setTimeout(() => {
          openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].number);
        }, 1200);
      } else {
        showToast("Waktu habis. Seluruh soal telah selesai.");
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

  if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
    showToast("Timer soal dilewati. Beralih ke soal berikutnya...");
    autoNextTimeout = setTimeout(() => {
      openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].number);
    }, 800);
  } else {
    showToast("Timer soal dilewati. Seluruh soal telah selesai.");
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

// === EVENT LISTENERS & SHORTCUTS ===
function setupEventListeners() {
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("btnBackToGrid").addEventListener("click", closeModal);

  document.getElementById("questionModalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "questionModalBackdrop") {
      closeModal();
    }
  });

  document.getElementById("btnPauseResume").addEventListener("click", pauseOrResumeTimer);
  document.getElementById("btnResetTimer").addEventListener("click", resetTimer);
  document.getElementById("btnSkipTransition").addEventListener("click", skipTransition);
  
  const btnSkipQ = document.getElementById("btnSkipQuestionTimer");
  if (btnSkipQ) {
    btnSkipQ.addEventListener("click", skipQuestionTimer);
  }

  document.getElementById("btnPrevQuestion").addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      openQuestionModal(QUESTIONS_DATA[currentQuestionIndex - 1].number);
    }
  });

  document.getElementById("btnNextQuestion").addEventListener("click", () => {
    if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
      openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].number);
    }
  });

  document.getElementById("btnToggleCompleted").addEventListener("click", () => {
    const q = QUESTIONS_DATA[currentQuestionIndex];
    if (completedQuestions.has(q.number)) {
      completedQuestions.delete(q.number);
      showToast(`Soal no. ${q.number} ditandai belum selesai`);
    } else {
      completedQuestions.add(q.number);
      showToast(`Soal no. ${q.number} ditandai selesai`);
    }
    saveCompletedQuestions();
    updateModalCompletedBtn();
    updateProgressStats();
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

  document.addEventListener("keydown", handleKeydown);
}

function handleKeydown(e) {
  const isModalOpen = document.getElementById("questionModalBackdrop").classList.contains("active");

  if (e.key === "Escape" && isModalOpen) {
    closeModal();
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
        openQuestionModal(QUESTIONS_DATA[currentQuestionIndex - 1].number);
      }
    } else if (e.key === "ArrowRight") {
      if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
        openQuestionModal(QUESTIONS_DATA[currentQuestionIndex + 1].number);
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
