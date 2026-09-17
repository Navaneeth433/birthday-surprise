/**
 * Nayana's 22nd Birthday Surprise — Core Application Logic
 * Optimized Canvas Particle System, Audio Synth, Level Quest Engine, Mobile Responsive, Cache-Busted Images
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentLevel: 1, // 0 = landing, 1 = timeline, 2 = photos, 3 = quiz, 4 = cipher, 5 = letter, 6 = cake
    maxUnlockedLevel: 1,
    audioMuted: true,
    l1Progress: {},
    l2Progress: {},
    l3Progress: {},
    l4Unlocked: false,
    candlesBlown: false
  };

  // Cache-Busting Image Helper to force fresh photo loads when files are replaced on disk!
  function getImageUrl(url) {
    if (!url) return '';
    const clean = url.trim();
    if (clean.startsWith('data:') || clean.startsWith('blob:')) return clean;
    const sep = clean.includes('?') ? '&' : '?';
    return clean + sep + 't=' + Date.now();
  }

  // Cache DOM Elements
  const DOM = {
    canvas: document.getElementById('particlesCanvas'),
    navBrandText: document.getElementById('nav-brand-text'),
    btnAudioToggle: document.getElementById('btn-audio-toggle'),
    audioIcon: document.getElementById('audio-icon'),
    btnCustomizeToggle: document.getElementById('btn-customize-toggle'),
    progressContainer: document.getElementById('progress-container'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-percentage-text'),
    stepBadges: document.querySelectorAll('.badge-step'),
    screens: document.querySelectorAll('.view-screen'),

    // Screens
    heroName: document.getElementById('hero-name-display'),
    heroSub: document.getElementById('hero-sub-text'),
    btnStartQuest: document.getElementById('btn-start-quest'),

    // Level 1: Timeline
    l1Title: document.getElementById('l1-title'),
    l1Subtitle: document.getElementById('l1-subtitle'),
    l1Container: document.getElementById('l1-questions-container'),
    btnL1Next: document.getElementById('btn-l1-next'),

    // Level 2: Photo Quiz
    l2Title: document.getElementById('l2-title'),
    l2Subtitle: document.getElementById('l2-subtitle'),
    l2Container: document.getElementById('l2-cards-container'),
    btnL2Next: document.getElementById('btn-l2-next'),

    // Level 3: Relationship Quiz
    l3Title: document.getElementById('l3-title'),
    l3Subtitle: document.getElementById('l3-subtitle'),
    l3Container: document.getElementById('l3-questions-container'),
    btnL3Next: document.getElementById('btn-l3-next'),

    // Level 4: Cipher Vault
    l4Title: document.getElementById('l4-title'),
    l4Subtitle: document.getElementById('l4-subtitle'),
    l4CluesList: document.getElementById('l4-clues-list'),
    passcodeWrapper: document.getElementById('passcode-inputs-wrapper'),
    btnVerifyCipher: document.getElementById('btn-verify-cipher'),
    vaultLockIcon: document.getElementById('vault-lock-icon'),

    // Letter
    letterHeading: document.getElementById('letter-heading-display'),
    letterBody: document.getElementById('letter-typed-body'),
    letterSignature: document.getElementById('letter-signature-display'),
    btnToCake: document.getElementById('btn-to-cake'),

    // Cake
    cakeTitle: document.getElementById('cake-title-display'),
    cakeSub: document.getElementById('cake-sub-display'),
    candlesContainer: document.getElementById('candles-container'),
    btnBlowCandles: document.getElementById('btn-blow-candles'),
    btnReplayQuest: document.getElementById('btn-replay-quest'),
    memoryWallGrid: document.getElementById('memory-wall-grid'),

    // Modals
    feedbackModal: document.getElementById('feedback-modal'),
    modalEmoji: document.getElementById('modal-emoji'),
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'),
    btnCloseFeedback: document.getElementById('btn-close-feedback'),

    customizerModal: document.getElementById('customizer-modal'),
    btnCloseCustomizer: document.getElementById('btn-close-customizer'),
    customizerForm: document.getElementById('customizer-form'),
    cfgName: document.getElementById('cfg-name'),
    cfgAge: document.getElementById('cfg-age'),
    cfgImg1: document.getElementById('cfg-img1'),
    cfgImg2: document.getElementById('cfg-img2'),
    cfgPasscode: document.getElementById('cfg-passcode'),
    cfgLetterText: document.getElementById('cfg-letter-text')
  };

  // ==========================================================================
  // WEB AUDIO SYNTHESIZER
  // ==========================================================================
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playTone(freq, type, duration, gainVal = 0.1) {
    if (state.audioMuted) return;
    initAudio();
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio play error:', e);
    }
  }

  function playChimeSFX() {
    playTone(523.25, 'sine', 0.2, 0.12);
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.12), 100);
    setTimeout(() => playTone(783.99, 'sine', 0.3, 0.15), 200);
  }

  function playSuccessFanfare() {
    playTone(523.25, 'triangle', 0.15, 0.15);
    setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.15), 120);
    setTimeout(() => playTone(783.99, 'triangle', 0.15, 0.15), 240);
    setTimeout(() => playTone(1046.50, 'triangle', 0.4, 0.2), 360);
  }

  function playWrongBuzz() {
    playTone(180, 'sawtooth', 0.25, 0.12);
  }

  let musicInterval = null;
  function startBgMusic() {
    if (musicInterval) clearInterval(musicInterval);
    const notes = [261.63, 329.63, 392.00, 493.88, 523.25];
    let index = 0;
    musicInterval = setInterval(() => {
      if (!state.audioMuted) {
        playTone(notes[index % notes.length], 'sine', 1.8, 0.03);
        index++;
      }
    }, 1400);
  }

  function stopBgMusic() {
    if (musicInterval) clearInterval(musicInterval);
  }

  // ==========================================================================
  // HIGH PERFORMANCE PARTICLES ENGINE
  // ==========================================================================
  const ambientParticles = [];
  const confettiParticles = [];

  function initParticles() {
    const ctx = DOM.canvas.getContext('2d');
    let width = (DOM.canvas.width = window.innerWidth);
    let height = (DOM.canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = DOM.canvas.width = window.innerWidth;
      height = DOM.canvas.height = window.innerHeight;
    });

    for (let i = 0; i < 22; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 10,
        speedY: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.4 + 0.2,
        symbol: Math.random() > 0.4 ? '🌸' : Math.random() > 0.5 ? '✨' : '💖'
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      ambientParticles.forEach((p) => {
        ctx.font = `${p.size}px sans-serif`;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.symbol, p.x, p.y);
        p.y -= p.speedY;
        p.x += Math.sin(p.y / 35) * 0.3;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
      });

      for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const c = confettiParticles[i];
        ctx.font = `${c.size}px sans-serif`;
        ctx.globalAlpha = Math.max(0, c.opacity);
        ctx.fillText(c.symbol, c.x, c.y);

        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.15;
        c.opacity -= 0.015;

        if (c.opacity <= 0 || c.y > height + 40) {
          confettiParticles.splice(i, 1);
        }
      }

      requestAnimationFrame(render);
    }
    render();
  }

  function triggerConfetti() {
    const symbols = ['🎉', '✨', '🎂', '💖', '⭐'];
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 3;

    for (let i = 0; i < 35; i++) {
      confettiParticles.push({
        x: startX + (Math.random() - 0.5) * 60,
        y: startY + (Math.random() - 0.5) * 40,
        size: Math.random() * 14 + 10,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.7) * 9,
        opacity: 1,
        symbol: symbols[Math.floor(Math.random() * symbols.length)]
      });
    }
  }

  // ==========================================================================
  // NAVIGATION & PROGRESS
  // ==========================================================================
  function showScreen(screenId) {
    DOM.screens.forEach((s) => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function updateProgress() {
    const totalLevels = 4;
    let unlockedCount = state.maxUnlockedLevel - 1;
    if (state.currentLevel === 5 || state.currentLevel === 6) unlockedCount = 4;
    const percentage = Math.min(100, Math.round((unlockedCount / totalLevels) * 100));

    DOM.progressFill.style.width = `${percentage}%`;
    DOM.progressText.textContent = `${percentage}% Unlocked`;

    DOM.stepBadges.forEach((badge) => {
      const step = parseInt(badge.getAttribute('data-step'), 10);
      badge.classList.remove('active', 'completed');
      if (step === state.currentLevel) {
        badge.classList.add('active');
      }
      if (step < state.maxUnlockedLevel || (step === 5 && state.currentLevel >= 5)) {
        badge.classList.add('completed');
      }
    });
  }

  function showFeedback(emoji, title, text) {
    DOM.modalEmoji.textContent = emoji;
    DOM.modalTitle.textContent = title;
    DOM.modalText.textContent = text;
    DOM.feedbackModal.classList.add('active');
  }

  function triggerTaunt(customTaunt) {
    playWrongBuzz();
    const taunts = window.STORY_CONFIG.wrongTaunts || [
      "Podi mandi ayye ih pollum arilla",
      "Kazhutha 😜",
      "Hmm kastamm"
    ];
    const tauntText = customTaunt || taunts[Math.floor(Math.random() * taunts.length)];
    const playfulEmojis = ['😜', '🤭', '💔😂', '👀', '🤐'];
    const emoji = playfulEmojis[Math.floor(Math.random() * playfulEmojis.length)];

    showFeedback(emoji, "Wrong Answer! 😜", tauntText);
  }

  // ==========================================================================
  // LEVEL 1 ENGINE: TIMELINE QUIZ
  // ==========================================================================
  function renderLevel1() {
    const cfg = window.STORY_CONFIG.level1;
    DOM.l1Title.textContent = cfg.title;
    DOM.l1Subtitle.textContent = cfg.subtitle;

    DOM.l1Container.innerHTML = '';
    cfg.questions.forEach((q, qIndex) => {
      const qBox = document.createElement('div');
      qBox.className = 'q-box';

      const title = document.createElement('div');
      title.className = 'q-title';
      title.innerHTML = `<span>Milestone ${qIndex + 1}:</span> ${q.question}`;
      qBox.appendChild(title);

      const optionsGrid = document.createElement('div');
      optionsGrid.className = 'options-grid';

      q.options.forEach((optText, optIndex) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = optText;

        btn.addEventListener('click', () => {
          if (optIndex === q.correctIndex) {
            state.l1Progress[q.id] = true;
            btn.classList.add('selected-correct');
            qBox.classList.add('answered');
            document.getElementById(`l1-result-${q.id}`).classList.add('active');
            playChimeSFX();

            const allDone = cfg.questions.every((item) => state.l1Progress[item.id]);
            if (allDone) {
              state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, 2);
              DOM.btnL1Next.style.display = 'inline-flex';
              updateProgress();
              triggerConfetti();
            }
          } else {
            btn.classList.add('selected-wrong');
            triggerTaunt(q.taunt);
            setTimeout(() => btn.classList.remove('selected-wrong'), 600);
          }
        });
        optionsGrid.appendChild(btn);
      });

      qBox.appendChild(optionsGrid);

      const resultBox = document.createElement('div');
      resultBox.className = 'timeline-result-card';
      resultBox.id = `l1-result-${q.id}`;
      resultBox.innerHTML = `<strong>${q.timelineYear}</strong> — ${q.timelineText}`;
      qBox.appendChild(resultBox);

      DOM.l1Container.appendChild(qBox);
    });
  }

  // ==========================================================================
  // LEVEL 2 ENGINE: GUESS THE MEMORY PHOTO QUIZ (CACHE-BUSTED PHOTO LOADING)
  // ==========================================================================
  function renderLevel2() {
    const cfg = window.STORY_CONFIG.level2;
    DOM.l2Title.textContent = cfg.title;
    DOM.l2Subtitle.textContent = cfg.subtitle;

    DOM.l2Container.innerHTML = '';
    cfg.cards.forEach((cardData) => {
      const pFrame = document.createElement('div');
      pFrame.className = 'polaroid-frame';

      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'polaroid-img-wrapper';

      const rawUrl = cardData.imageUrl || 'assets/photo1.jpg';
      const img = document.createElement('img');
      img.className = 'polaroid-img';
      img.src = getImageUrl(rawUrl);
      img.style.filter = `blur(${cardData.blurStart || 25}px)`;
      img.id = `l2-img-${cardData.id}`;

      img.onerror = () => {
        img.style.display = 'none';
        const placeHolder = document.createElement('div');
        placeHolder.className = 'polaroid-placeholder';
        placeHolder.textContent = cardData.placeholderText || '🌸';
        placeHolder.id = `l2-img-${cardData.id}`;
        imgWrapper.appendChild(placeHolder);
      };

      imgWrapper.appendChild(img);
      pFrame.appendChild(imgWrapper);

      const caption = document.createElement('div');
      caption.className = 'polaroid-caption';
      caption.textContent = cardData.title;
      pFrame.appendChild(caption);

      const qText = document.createElement('p');
      qText.style.fontSize = '0.92rem';
      qText.style.margin = '8px 0';
      qText.style.textAlign = 'center';
      qText.textContent = cardData.question;
      pFrame.appendChild(qText);

      const optsGrid = document.createElement('div');
      optsGrid.className = 'options-grid';

      cardData.options.forEach((optText, oIdx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = optText;

        btn.addEventListener('click', () => {
          if (oIdx === cardData.correctIndex) {
            state.l2Progress[cardData.id] = true;
            btn.classList.add('selected-correct');
            const targetVisual = pFrame.querySelector(`#l2-img-${cardData.id}`);
            if (targetVisual) targetVisual.style.filter = 'blur(0px)';
            playChimeSFX();
            showFeedback('📸', 'Memory Revealed!', cardData.caption);

            const allDone = cfg.cards.every((c) => state.l2Progress[c.id]);
            if (allDone) {
              state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, 3);
              DOM.btnL2Next.style.display = 'inline-flex';
              updateProgress();
              triggerConfetti();
            }
          } else {
            btn.classList.add('selected-wrong');
            triggerTaunt(cardData.taunt);
            setTimeout(() => btn.classList.remove('selected-wrong'), 600);
          }
        });
        optsGrid.appendChild(btn);
      });

      pFrame.appendChild(optsGrid);
      DOM.l2Container.appendChild(pFrame);
    });
  }

  // ==========================================================================
  // LEVEL 3 ENGINE: HOW WELL DO YOU KNOW US?
  // ==========================================================================
  function renderLevel3() {
    const cfg = window.STORY_CONFIG.level3;
    DOM.l3Title.textContent = cfg.title;
    DOM.l3Subtitle.textContent = cfg.subtitle;

    DOM.l3Container.innerHTML = '';
    cfg.questions.forEach((q) => {
      const box = document.createElement('div');
      box.className = 'q-box';

      const title = document.createElement('div');
      title.className = 'q-title';
      title.textContent = q.question;
      box.appendChild(title);

      const optsGrid = document.createElement('div');
      optsGrid.className = 'options-grid';

      q.options.forEach((optText, oIdx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = optText;

        btn.addEventListener('click', () => {
          if (oIdx === q.correctIndex) {
            state.l3Progress[q.id] = true;
            btn.classList.add('selected-correct');
            playChimeSFX();
            showFeedback('❤️', 'Aww!', q.sweetResponse);

            const allDone = cfg.questions.every((item) => state.l3Progress[item.id]);
            if (allDone) {
              state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, 4);
              DOM.btnL3Next.style.display = 'inline-flex';
              updateProgress();
              triggerConfetti();
            }
          } else {
            btn.classList.add('selected-wrong');
            triggerTaunt(q.taunt);
            setTimeout(() => btn.classList.remove('selected-wrong'), 600);
          }
        });
        optsGrid.appendChild(btn);
      });

      box.appendChild(optsGrid);
      DOM.l3Container.appendChild(box);
    });
  }

  // ==========================================================================
  // LEVEL 4 ENGINE: PASSCODE CIPHER
  // ==========================================================================
  function renderLevel4() {
    const cfg = window.STORY_CONFIG.level4;
    DOM.l4Title.textContent = cfg.title;
    DOM.l4Subtitle.textContent = cfg.subtitle;

    DOM.l4CluesList.innerHTML = '';
    cfg.clues.forEach((c) => {
      const item = document.createElement('div');
      item.style.marginBottom = '6px';
      item.innerHTML = `<strong>Clue ${c.step}:</strong> ${c.text} → <span style="color:var(--primary-pink); font-weight:bold;">${c.valueHint}</span>`;
      DOM.l4CluesList.appendChild(item);
    });

    const passcode = cfg.secretPasscode || 'NAYANA22';
    DOM.passcodeWrapper.innerHTML = '';

    for (let i = 0; i < passcode.length; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'passcode-input';
      input.dataset.index = i;

      input.addEventListener('input', (e) => {
        if (e.target.value) {
          const next = DOM.passcodeWrapper.querySelector(`[data-index="${i + 1}"]`);
          if (next) next.focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value) {
          const prev = DOM.passcodeWrapper.querySelector(`[data-index="${i - 1}"]`);
          if (prev) prev.focus();
        }
      });

      DOM.passcodeWrapper.appendChild(input);
    }

    DOM.btnVerifyCipher.onclick = () => {
      let entered = '';
      DOM.passcodeWrapper.querySelectorAll('.passcode-input').forEach((inp) => {
        entered += inp.value;
      });

      if (entered.trim().toUpperCase() === passcode.toUpperCase()) {
        state.l4Unlocked = true;
        state.maxUnlockedLevel = Math.max(state.maxUnlockedLevel, 5);
        DOM.vaultLockIcon.textContent = '🔓';
        playSuccessFanfare();
        triggerConfetti();

        showFeedback('🔑', 'ACCESS GRANTED!', cfg.successMessage || 'You unlocked the Birthday Letter!');
        setTimeout(() => {
          state.currentLevel = 5;
          renderCurrentScreen();
        }, 1400);
      } else {
        triggerTaunt("Wrong secret code! Check the clues above, Nayu! 🔐😜");
        DOM.passcodeWrapper.querySelectorAll('.passcode-input').forEach((inp) => {
          inp.style.borderColor = '#E53E3E';
          setTimeout(() => (inp.style.borderColor = '#FFCCD5'), 800);
        });
      }
    };
  }

  // ==========================================================================
  // FINAL LETTER REVEAL
  // ==========================================================================
  function renderLetter() {
    const letterData = window.STORY_CONFIG.letter;

    DOM.letterHeading.textContent = `Happy 22nd Birthday, ${window.STORY_CONFIG.girlfriend.nickname}! 💌`;
    DOM.letterSignature.textContent = letterData.signature || 'Forever & Always Yours ❤️';

    DOM.letterBody.innerHTML = '';
    let pIndex = 0;

    function typeParagraphs() {
      if (pIndex < letterData.paragraphs.length) {
        const p = document.createElement('p');
        p.className = 'letter-paragraph';
        p.textContent = letterData.paragraphs[pIndex];
        DOM.letterBody.appendChild(p);
        pIndex++;
        setTimeout(typeParagraphs, 500);
      }
    }
    typeParagraphs();
  }

  // ==========================================================================
  // BIRTHDAY CAKE & CANDLE BLOW ENGINE (CACHE-BUSTED MEMORY WALL PHOTOS)
  // ==========================================================================
  function renderCake() {
    const cakeCfg = window.STORY_CONFIG.cake;
    DOM.cakeTitle.textContent = cakeCfg.title || 'Make a Wish, Nayana! 🎂';
    DOM.cakeSub.textContent = cakeCfg.subtitle || 'Blow out the 22 birthday candles to trigger your celebration!';

    DOM.candlesContainer.innerHTML = '';
    const numCandles = 8;
    for (let i = 0; i < numCandles; i++) {
      const candle = document.createElement('div');
      candle.className = 'candle';
      const flame = document.createElement('div');
      flame.className = 'candle-flame';
      flame.id = `flame-${i}`;
      candle.appendChild(flame);
      DOM.candlesContainer.appendChild(candle);
    }

    DOM.btnBlowCandles.onclick = () => {
      document.querySelectorAll('.candle-flame').forEach((flame, index) => {
        setTimeout(() => {
          flame.classList.add('extinguished');
        }, index * 90);
      });
      playSuccessFanfare();
      triggerConfetti();
      showFeedback('🎉', 'Happy 22nd Birthday Nayana!', 'Your wish has been sent to the universe! ❤️✨');
    };

    DOM.memoryWallGrid.innerHTML = '';
    window.STORY_CONFIG.memoryWall.forEach((mem, idx) => {
      const frame = document.createElement('div');
      frame.className = 'polaroid-frame';

      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'polaroid-img-wrapper';

      const rawUrl = mem.imageUrl || (idx === 0 ? 'assets/memory1.jpg' : idx === 1 ? 'assets/memory2.jpg' : 'assets/memory3.jpg');
      const img = document.createElement('img');
      img.className = 'polaroid-img';
      img.src = getImageUrl(rawUrl);
      img.onerror = () => {
        img.style.display = 'none';
        const placeHolder = document.createElement('div');
        placeHolder.className = 'polaroid-placeholder';
        placeHolder.textContent = '🌸';
        imgWrapper.appendChild(placeHolder);
      };
      imgWrapper.appendChild(img);
      frame.appendChild(imgWrapper);

      const cap = document.createElement('div');
      cap.className = 'polaroid-caption';
      cap.textContent = mem.caption;
      frame.appendChild(cap);

      const note = document.createElement('p');
      note.style.fontSize = '0.88rem';
      note.style.textAlign = 'center';
      note.style.color = 'var(--text-muted)';
      note.style.marginTop = '6px';
      note.textContent = `"${mem.note}"`;
      frame.appendChild(note);

      DOM.memoryWallGrid.appendChild(frame);
    });
  }

  // ==========================================================================
  // MAIN APP ROUTER
  // ==========================================================================
  function renderCurrentScreen() {
    updateProgress();
    switch (state.currentLevel) {
      case 0:
      case 1:
        renderLevel1();
        showScreen('screen-level1');
        break;
      case 2:
        renderLevel2();
        showScreen('screen-level2');
        break;
      case 3:
        renderLevel3();
        showScreen('screen-level3');
        break;
      case 4:
        renderLevel4();
        showScreen('screen-level4');
        break;
      case 5:
        renderLetter();
        showScreen('screen-letter');
        break;
      case 6:
        renderCake();
        showScreen('screen-cake');
        break;
      default:
        showScreen('screen-landing');
    }
  }

  // ==========================================================================
  // INITIALIZATION & EVENT BINDINGS
  // ==========================================================================
  function bindEvents() {
    DOM.btnAudioToggle.addEventListener('click', () => {
      state.audioMuted = !state.audioMuted;
      DOM.audioIcon.textContent = state.audioMuted ? '🔇' : '🎵';
      if (!state.audioMuted) {
        initAudio();
        startBgMusic();
      } else {
        stopBgMusic();
      }
    });

    DOM.btnStartQuest.addEventListener('click', () => {
      state.currentLevel = 1;
      renderCurrentScreen();
    });

    DOM.btnL1Next.addEventListener('click', () => {
      state.currentLevel = 2;
      renderCurrentScreen();
    });

    DOM.btnL2Next.addEventListener('click', () => {
      state.currentLevel = 3;
      renderCurrentScreen();
    });

    DOM.btnL3Next.addEventListener('click', () => {
      state.currentLevel = 4;
      renderCurrentScreen();
    });

    DOM.btnToCake.addEventListener('click', () => {
      state.currentLevel = 6;
      renderCurrentScreen();
    });

    DOM.btnReplayQuest.addEventListener('click', () => {
      state.currentLevel = 1;
      renderCurrentScreen();
    });

    DOM.stepBadges.forEach((badge) => {
      badge.addEventListener('click', () => {
        const step = parseInt(badge.getAttribute('data-step'), 10);
        if (step <= state.maxUnlockedLevel || (step === 5 && state.l4Unlocked)) {
          state.currentLevel = step;
          renderCurrentScreen();
        }
      });
    });

    DOM.btnCloseFeedback.addEventListener('click', () => {
      DOM.feedbackModal.classList.remove('active');
    });

    DOM.btnCustomizeToggle.addEventListener('click', () => {
      const gf = window.STORY_CONFIG.girlfriend;
      DOM.cfgName.value = gf.fullName;
      DOM.cfgAge.value = gf.turningAge;
      DOM.cfgImg1.value = window.STORY_CONFIG.level2.cards[0].imageUrl || 'assets/photo1.jpg';
      DOM.cfgImg2.value = window.STORY_CONFIG.level2.cards[1].imageUrl || 'assets/photo2.jpg';
      DOM.cfgPasscode.value = window.STORY_CONFIG.level4.secretPasscode || 'NAYANA22';
      DOM.cfgLetterText.value = window.STORY_CONFIG.letter.paragraphs.join('\n\n');
      DOM.customizerModal.classList.add('active');
    });

    DOM.btnCloseCustomizer.addEventListener('click', () => {
      DOM.customizerModal.classList.remove('active');
    });

    DOM.customizerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.STORY_CONFIG.girlfriend.fullName = DOM.cfgName.value.trim();
      window.STORY_CONFIG.girlfriend.nickname = DOM.cfgName.value.trim().split(' ')[0];
      window.STORY_CONFIG.girlfriend.turningAge = parseInt(DOM.cfgAge.value, 10);

      if (DOM.cfgImg1.value.trim()) {
        window.STORY_CONFIG.level2.cards[0].imageUrl = DOM.cfgImg1.value.trim();
      }
      if (DOM.cfgImg2.value.trim()) {
        window.STORY_CONFIG.level2.cards[1].imageUrl = DOM.cfgImg2.value.trim();
      }

      window.STORY_CONFIG.level4.secretPasscode = DOM.cfgPasscode.value.trim().toUpperCase();

      const newParaText = DOM.cfgLetterText.value.trim();
      if (newParaText) {
        window.STORY_CONFIG.letter.paragraphs = newParaText.split('\n\n');
      }

      DOM.heroName.textContent = window.STORY_CONFIG.girlfriend.nickname;
      DOM.customizerModal.classList.remove('active');
      showFeedback('✨', 'Story Updated!', 'Your live edits and image paths have been applied!');
      renderCurrentScreen();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    bindEvents();
    renderCurrentScreen();
  });

})();
