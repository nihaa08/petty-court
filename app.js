/**
 * PETTY COURT — CLIENT ENGINE & JUDICIAL SIMULATOR
 * Supreme Tribunal of Domestic Animal Misdemeanors
 * Pure Vanilla JavaScript — Zero External Dependencies
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (Acoustic Gavels & Courtroom Audio)
  // =========================================================================
  let audioCtx = null;
  let isMuted = localStorage.getItem('petty_sound_muted') === 'true';

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Realistic synthesized wooden gavel strike
  function playGavelStrike(doubleTap = true) {
    if (isMuted) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const triggerSingleStrike = (delayMs) => {
        setTimeout(() => {
          const now = audioCtx.currentTime;

          // 1. Resonant wood block body
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

          gain.gain.setValueAtTime(0.85, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.22);

          // 2. High impact transient noise burst
          const bufferSize = audioCtx.sampleRate * 0.04;
          const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const whiteNoise = audioCtx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800, now);
          filter.Q.setValueAtTime(3, now);

          const noiseGain = audioCtx.createGain();
          noiseGain.gain.setValueAtTime(0.5, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(audioCtx.destination);
          whiteNoise.start(now);
        }, delayMs);
      };

      triggerSingleStrike(0);
      if (doubleTap) {
        triggerSingleStrike(140);
      }
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked:', e);
    }
  }

  // Rubber ink stamp impact
  function playStampImpact() {
    if (isMuted) return;
    try {
      initAudioContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.25);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {
      console.warn('Stamp audio error:', e);
    }
  }

  // Gentle bell chime for citations
  function playBailiffChime() {
    if (isMuted) return;
    try {
      initAudioContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1320, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {
      console.warn('Chime audio error:', e);
    }
  }

  // =========================================================================
  // 2. DATA STORE & PRESET DOSSIERS
  // =========================================================================

  const PRESET_JUDGES = [
    {
      id: 'judge-barnaby',
      name: 'Chief Justice Barnaby Whiskers III',
      title: 'Senior Feline Magistrate',
      credo: '"Guilty until proven catnip. Dogs have no standing in my court."',
      avatar: 'assets/judge-cat.svg',
      bias: 'feline_supremacy',
      quotes: [
        'Chief Justice Whiskers: "The court finds that knocking items from tables is a protected gravitational research activity."',
        'Chief Justice Whiskers: "I have reviewed Exhibit A, then pushed it off the bench. Case adjourned for sunbeam nap."',
        'Chief Justice Whiskers: "Bailiff, confiscate all vacuum cleaners within a three-mile jurisdiction."'
      ]
    },
    {
      id: 'judge-barkslot',
      name: 'Magistrate Sir Reginald Barks-a-Lot',
      title: 'Baron of Bellyrubs',
      credo: '"All charges dismissed if defendant has cheese or is willing to fetch."',
      avatar: 'assets/judge-dog.svg',
      bias: 'bribe_susceptible',
      quotes: [
        'Magistrate Reginald: "Who is a good boy? That is the primary constitutional question before us today."',
        'Magistrate Reginald: "The prosecution alleges slipper destruction. But has the defense considered that slippers look like enemies?"',
        'Magistrate Reginald: "I accept a 10% bribe in mild cheddar to reduce this felony to a soft pat on the head."'
      ]
    },
    {
      id: 'judge-beaver',
      name: 'Hon. Ruth Beaver Ginsburg',
      title: 'Chief Justice of Structural Integrity',
      credo: '"Any furniture leg chewed without a permit constitutes high municipal treason."',
      avatar: 'assets/judge-beaver.svg',
      bias: 'strict_constructionist',
      quotes: [
        'Judge Ginsburg: "I dissent! The dam code of 1884 strictly forbids nocturnal chewing of baseboards."',
        'Judge Ginsburg: "Woodcraft is sacred. To chew a chair leg without structural purpose is pure negligence."',
        'Judge Ginsburg: "The defendant will perform 40 hours of compulsory twig gathering along the riverbed."'
      ]
    },
    {
      id: 'judge-owl',
      name: 'Lady Henrietta Peck',
      title: 'High Magistrate of Night Court',
      credo: '"I see all 3 AM zoomies. Whoooo did it? You did it."',
      avatar: 'assets/judge-owl.svg',
      bias: 'night_hawk',
      quotes: [
        'Lady Peck: "Whoooo was awake at 03:42 AM running across the duvet? The evidence is indisputable."',
        'Lady Peck: "The court does not sleep. Neither did the owner after your unprovoked screech."',
        'Lady Peck: "Motion for bail denied. Defendant must remain grounded until dawn."'
      ]
    }
  ];

  const INITIAL_CASES = [
    {
      id: 'pc-9042',
      docketNo: '#PC-2026-9042',
      name: 'Barnaby von Claws',
      alias: 'The 3 AM Poltergeist',
      species: 'British Shorthair Cat',
      category: 'feline',
      status: 'IN CUSTODY',
      statusClass: 'status-custody',
      avatar: 'assets/suspect-cat1.svg',
      charge: 'Aggravated Water Glass Defenestration',
      statement: 'Maintained direct eye contact with victim while slowly pushing a full 16oz tumbler of ice water off the mahogany nightstand at 04:12 AM.',
      defense: '"The glass was perched precariously and I was simply verifying the local gravitational constant."',
      exhibits: {
        A: 'Shattered crystal shards, soaked Persian rug, and water damage to victim\'s bedside paperback novel.',
        B: 'Victim security camera footage showing suspect batting the rim with calculated methodical precision.',
        C: '3 prior citations for unprovoked swatting of innocent dangling headphone cables.'
      },
      guiltyVotes: 412,
      innocentVotes: 38
    },
    {
      id: 'pc-4412',
      docketNo: '#PC-2026-4412',
      name: 'Sir Wigglebottom',
      alias: 'The Sourdough Bandit',
      species: 'Golden Retriever',
      category: 'canine',
      status: 'ON BAIL',
      statusClass: 'status-bail',
      avatar: 'assets/suspect-dog1.svg',
      charge: 'Grand Larceny of Artisanal Loaf',
      statement: 'Suspect exploited an unattended 4-minute kitchen counter window to consume an entire 24-hour fermented artisan sourdough boule.',
      defense: '"The bread was clearly abandoned property under the International Countertop Maritime Code of 1994."',
      exhibits: {
        A: 'Suspicious dusting of high-gluten white flour adhering to defendant\'s moist black nose.',
        B: 'A remarkably round, balloon-like belly and total inability to fit beneath the dining bench.',
        C: 'Prior warnings regarding the butter dish of Christmas 2024.'
      },
      guiltyVotes: 145,
      innocentVotes: 289
    },
    {
      id: 'pc-0342',
      docketNo: '#PC-2026-0342',
      name: 'Cleo & Pepper',
      alias: 'The Zoomies Syndicate',
      species: 'Tabby Duo',
      category: 'feline',
      status: 'FLED BENCH',
      statusClass: 'status-custody',
      avatar: 'assets/suspect-cats2.svg',
      charge: 'Criminal Disturbance & Wall Rebound Assault',
      statement: 'Joint conspiracy to achieve Mach 1 across sleeping human heads, utilizing wall rebounds at precisely 03:42 AM on a Monday morning.',
      defense: '"We were actively expelling malevolent nocturnal spirits from the hallway closet. You owe us your lives."',
      exhibits: {
        A: 'Deep claw skid marks in the master bedroom 800-thread-count duvet cover.',
        B: 'Audio recording registering 78 decibels of thundering paws and a falling brass lamp.',
        C: 'Subsequent grooming of rear legs with blatant indifference to owner\'s work meeting.'
      },
      guiltyVotes: 388,
      innocentVotes: 52
    },
    {
      id: 'pc-7801',
      docketNo: '#PC-2026-7801',
      name: 'Captain Beaks',
      alias: 'The Microwave Mimic',
      species: 'African Grey Parrot',
      category: 'avian',
      status: 'BRIBE ATTEMPTED',
      statusClass: 'status-bail',
      avatar: 'assets/suspect-parrot1.svg',
      charge: 'Psychological Warfare via Phantom Kitchen Beeps',
      statement: 'Accused perfected the exact sonic replica of the kitchen microwave timer, causing victim to walk into the kitchen 19 times expecting hot soup.',
      defense: '"The sounds were performed strictly under First Amendment protections of artistic musical expression."',
      exhibits: {
        A: 'Log of 19 unnecessary human trips to an empty, unheated microwave oven.',
        B: 'Parrot laughing in owner\'s exact chuckle immediately after each false alarm.',
        C: 'Prior imitation of the smoke detector during a high-stakes Zoom job interview.'
      },
      guiltyVotes: 295,
      innocentVotes: 110
    },
    {
      id: 'pc-3309',
      docketNo: '#PC-2026-3309',
      name: 'Sir Nibblesworth',
      alias: 'The Cable Cutter',
      species: 'Holland Lop Rabbit',
      category: 'avian',
      status: 'IN CUSTODY',
      statusClass: 'status-custody',
      avatar: 'assets/suspect-bunny1.svg',
      charge: 'Sabotage of High-Voltage Apple Infrastructure',
      statement: 'Cleanly severed an OEM $89 USB-C MagSafe woven cable at a surgical 45-degree angle in under 1.2 seconds.',
      defense: '"The offending item was white, flexible, and closely resembled artisanal spicy spaghetti."',
      exhibits: {
        A: 'Severed copper braided wire displaying clean incisor markings.',
        B: 'Defendant discovered sitting directly on laptop cooling vent looking remarkably innocent.',
        C: 'Unlawful nibbling of baseboards in master bathroom.'
      },
      guiltyVotes: 310,
      innocentVotes: 98
    },
    {
      id: 'pc-5582',
      docketNo: '#PC-2026-5582',
      name: 'Duke Fluffington',
      alias: 'The Cashmere Squatter',
      species: 'Ragdoll Cat',
      category: 'feline',
      status: 'ON BAIL',
      statusClass: 'status-bail',
      avatar: 'assets/suspect-cat2.svg',
      charge: 'Unlawful Occupation of Fresh Dark Laundry',
      statement: 'Defendant waited for victim to fold pristine black cashmere sweater, then immediately collapsed full body weight into center of pile.',
      defense: '"Black clothing requires contrast. I was providing complementary angora highlights at zero cost."',
      exhibits: {
        A: 'Six million pure white hairs fused permanently into woven Italian wool.',
        B: 'Defendant purring at 48 Hz while refusing to be moved by lint roller.',
        C: 'Complete abandonment of the $120 orthopedic memory foam pet bed.'
      },
      guiltyVotes: 360,
      innocentVotes: 74
    }
  ];

  const INITIAL_FAME = [
    {
      id: 'fame-1',
      title: 'The Great Thanksgiving Turkey Heist',
      defendant: 'Barnaby Sr. (Golden Retriever)',
      alias: 'The 3-Second Hoover',
      crime: 'Inhaled an entire 14-lb roasted turkey in 3.8 seconds while the extended family closed their eyes for grace.',
      punishment: 'Sentenced to 6 months of eating standard kibble with zero gravy dispensation.',
      avatar: 'assets/suspect-dog1.svg',
      pardons: 524,
      sentences: 312
    },
    {
      id: 'fame-2',
      title: 'The 24-Roll TP Avalanche of 2023',
      defendant: 'Duchess Cleo (Calico Cat)',
      alias: 'The Egyptian Mummy',
      crime: 'Unspooled 24 rolls of three-ply bathroom tissue, creating an uninterrupted white carpet across two staircases.',
      punishment: 'Forfeiture of all cardboard box privileges for 30 consecutive calendar days.',
      avatar: 'assets/suspect-cat1.svg',
      pardons: 408,
      sentences: 620
    },
    {
      id: 'fame-3',
      title: 'The Board Meeting Disruption',
      defendant: 'Admiral Squawk (Macaw)',
      alias: 'The Chief Executive Parrot',
      crime: 'Repeatedly shouted "YOU ARE ALL FIRED" into victim\'s wireless headset during annual performance reviews.',
      punishment: 'Compulsory confinement to cage listening only to soothing smooth jazz.',
      avatar: 'assets/suspect-parrot1.svg',
      pardons: 789,
      sentences: 142
    }
  ];

  // Load cases from localStorage or seed
  let activeCases = [];
  function loadStoredCases() {
    try {
      const stored = localStorage.getItem('petty_court_cases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeCases = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read stored cases, using seeds:', e);
    }
    activeCases = [...INITIAL_CASES];
    saveStoredCases();
  }

  function saveStoredCases() {
    try {
      localStorage.setItem('petty_court_cases', JSON.stringify(activeCases));
    } catch (e) {
      console.warn('Could not persist cases:', e);
    }
  }

  // Current Trial State
  let currentJudge = PRESET_JUDGES[0];
  let currentCase = INITIAL_CASES[0];
  let stenographerInterval = null;

  // =========================================================================
  // 3. SOUND CONTROLS & NAVIGATION
  // =========================================================================
  function initHeaderControls() {
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      updateSoundButtonUI(soundBtn);
      soundBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('petty_sound_muted', isMuted);
        updateSoundButtonUI(soundBtn);
        if (!isMuted) {
          playBailiffChime();
        }
      });
    }

    // Header scroll background effect
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Mobile nav hamburger
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
      // Close menu on link click
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
        });
      });
    }
  }

  function updateSoundButtonUI(btn) {
    if (isMuted) {
      btn.classList.add('muted');
      btn.innerHTML = '<span>🔇</span> Sound: OFF';
      btn.setAttribute('aria-label', 'Unmute courtroom sound effects');
    } else {
      btn.classList.remove('muted');
      btn.innerHTML = '<span>🔊</span> Sound: ON';
      btn.setAttribute('aria-label', 'Mute courtroom sound effects');
    }
  }

  // Track cases user has voted on in this session
  let userVotes = {};
  try {
    userVotes = JSON.parse(localStorage.getItem('petty_user_voted_cases') || '{}');
  } catch (e) {
    userVotes = {};
  }

  // Toast Notification Helper
  function showCourtToast(msg, icon = '⚖️') {
    let toast = document.getElementById('courtToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'courtToast';
      toast.className = 'court-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="court-toast-icon">${icon}</span><div class="court-toast-msg">${msg}</div>`;
    toast.classList.add('show');
    if (window._toastTimer) clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // =========================================================================
  // 4. ACTIVE DOCKET GALLERY & FILTERING
  // =========================================================================
  let currentFilter = 'all';
  let searchQuery = '';

  function initDocketGallery() {
    const grid = document.getElementById('docketGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('docketSearchInput');

    if (!grid) return;

    // Filter pill buttons
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        renderDocketCards();
      });
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = (e.target.value || '').trim().toLowerCase();
        renderDocketCards();
      });
    }

    // Attach click listener ONCE using event delegation
    attachDocketListeners(grid);

    renderDocketCards();
  }

  function renderDocketCards() {
    const grid = document.getElementById('docketGrid');
    if (!grid) return;

    let filtered = activeCases.filter(c => {
      // Category filter
      if (currentFilter === 'citizen') {
        if (!c.isCitizen) return false;
      } else if (currentFilter !== 'all' && c.category !== currentFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const text = `${c.name} ${c.alias} ${c.charge} ${c.species} ${c.docketNo}`.toLowerCase();
        if (!text.includes(searchQuery)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="docket-empty-state">
          <div class="docket-empty-icon">⚖️</div>
          <h3 style="font-family: var(--font-serif); color: var(--gold-light); margin-bottom: 0.5rem;">No Defendants Found</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">No petty criminals match your search criteria. Perhaps they fled the jurisdiction?</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(c => {
      const totalVotes = (c.guiltyVotes || 0) + (c.innocentVotes || 0) || 1;
      const guiltyPct = Math.round(((c.guiltyVotes || 0) / totalVotes) * 100);
      const innocentPct = 100 - guiltyPct;
      const userChoice = userVotes[c.id];

      return `
        <article class="case-card" data-case-id="${c.id}">
          <div class="card-header-bar">
            <span class="docket-number">${c.docketNo}</span>
            <span class="case-status-badge ${c.statusClass || 'status-custody'}">${c.status || 'CHARGED'}</span>
          </div>

          <div class="card-mugshot-wrap">
            <img class="card-mugshot-img" src="${c.avatar}" alt="${c.name} Mugshot" onerror="this.onerror=null; this.src='assets/suspect-cat1.svg';">
            <span class="species-tag">${c.species}</span>
          </div>

          <div class="card-body">
            <h3 class="card-defendant-name">${c.name}</h3>
            <div class="card-alias">AKA "${c.alias}"</div>

            <div class="card-charge-box">
              <span class="charge-label">Indictment</span>
              <p class="charge-text">${c.charge}</p>
            </div>

            <p class="card-details-excerpt">${c.statement}</p>

            <div class="card-jury-sentiment">
              <div class="jury-sentiment-header">
                <span class="sentiment-guilty-label">Guilty: ${guiltyPct}%</span>
                <span class="sentiment-innocent-label">Innocent: ${innocentPct}%</span>
              </div>
              <div class="sentiment-meter">
                <div class="sentiment-meter-fill" style="width: ${guiltyPct}%;"></div>
              </div>

              <div class="jury-vote-actions">
                <button class="btn-vote btn-vote-guilty ${userChoice === 'guilty' ? 'voted' : ''}" data-action="vote-guilty" data-id="${c.id}">
                  🔨 Guilty (${c.guiltyVotes || 0})
                </button>
                <button class="btn-vote btn-vote-innocent ${userChoice === 'innocent' ? 'voted' : ''}" data-action="vote-innocent" data-id="${c.id}">
                  😇 Innocent (${c.innocentVotes || 0})
                </button>
              </div>
            </div>

            <div class="card-bottom-actions">
              <button class="btn btn-primary btn-sm" data-action="trial-bench" data-id="${c.id}">
                ⚖️ Put On Trial
              </button>
              <button class="btn btn-secondary btn-sm" data-action="view-evidence" data-id="${c.id}">
                📂 Exhibits
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function attachDocketListeners(grid) {
    grid.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const caseId = target.getAttribute('data-id');
      const caseItem = activeCases.find(c => c.id === caseId);

      if (!caseItem) return;

      if (action === 'vote-guilty') {
        caseItem.guiltyVotes = (caseItem.guiltyVotes || 0) + 1;
        userVotes[caseId] = 'guilty';
        localStorage.setItem('petty_user_voted_cases', JSON.stringify(userVotes));
        saveStoredCases();
        playStampImpact();
        showCourtToast(`Jury vote recorded: <strong>${caseItem.name}</strong> declared GUILTY!`, '🔨');
        renderDocketCards();
      } else if (action === 'vote-innocent') {
        caseItem.innocentVotes = (caseItem.innocentVotes || 0) + 1;
        userVotes[caseId] = 'innocent';
        localStorage.setItem('petty_user_voted_cases', JSON.stringify(userVotes));
        saveStoredCases();
        playBailiffChime();
        showCourtToast(`Jury vote recorded: <strong>${caseItem.name}</strong> declared INNOCENT!`, '😇');
        renderDocketCards();
      } else if (action === 'trial-bench') {
        loadCaseIntoBench(caseItem);
        playBailiffChime();
        const courtroomSection = document.getElementById('courtroom');
        if (courtroomSection) {
          courtroomSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (action === 'view-evidence') {
        loadCaseIntoBench(caseItem);
        playBailiffChime();
        const courtroomSection = document.getElementById('courtroom');
        if (courtroomSection) {
          courtroomSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // =========================================================================
  // 5. INTERACTIVE COURTROOM BENCH
  // =========================================================================
  function initCourtroomBench() {
    renderJudgesBar();
    populateBenchCaseSelector();
    setupEvidenceTabs();
    setupGavelAction();
    loadCaseIntoBench(currentCase);
    startStenographer();
  }

  function renderJudgesBar() {
    const container = document.getElementById('judgesGrid');
    if (!container) return;

    container.innerHTML = PRESET_JUDGES.map(j => `
      <button class="judge-card-btn ${j.id === currentJudge.id ? 'active' : ''}" data-judge-id="${j.id}">
        <img class="judge-avatar-mini" src="${j.avatar}" alt="${j.name}">
        <div class="judge-btn-info">
          <span class="judge-btn-name">${j.name}</span>
          <span class="judge-btn-title">${j.title}</span>
        </div>
      </button>
    `).join('');

    container.querySelectorAll('.judge-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-judge-id');
        const selected = PRESET_JUDGES.find(j => j.id === id);
        if (selected) {
          currentJudge = selected;
          renderJudgesBar();
          updatePresidingJudgeUI();
          playBailiffChime();
          typeStenographerLine(`${currentJudge.name} enters the courtroom. All paws rise.`);
        }
      });
    });
  }

  function updatePresidingJudgeUI() {
    const avatar = document.getElementById('presidingJudgeAvatar');
    const name = document.getElementById('presidingJudgeName');
    const credo = document.getElementById('presidingJudgeCredo');

    if (avatar) avatar.src = currentJudge.avatar;
    if (name) name.textContent = currentJudge.name;
    if (credo) credo.textContent = currentJudge.credo;
  }

  function populateBenchCaseSelector() {
    const select = document.getElementById('benchCaseSelect');
    if (!select) return;

    select.innerHTML = activeCases.map(c => `
      <option value="${c.id}" ${c.id === currentCase.id ? 'selected' : ''}>
        ${c.docketNo} — ${c.name} (${c.charge})
      </option>
    `).join('');

    select.addEventListener('change', (e) => {
      const selected = activeCases.find(c => c.id === e.target.value);
      if (selected) {
        loadCaseIntoBench(selected);
      }
    });
  }

  function loadCaseIntoBench(caseItem) {
    currentCase = caseItem;

    // Update defendant stand
    const standName = document.getElementById('standDefendantName');
    const standAlias = document.getElementById('standDefendantAlias');
    const standSpecies = document.getElementById('standDefendantSpecies');
    const standMugshot = document.getElementById('standMugshotImg');
    const standDocket = document.getElementById('standDocketTag');
    const select = document.getElementById('benchCaseSelect');

    if (standName) standName.textContent = caseItem.name;
    if (standAlias) standAlias.textContent = `AKA "${caseItem.alias}"`;
    if (standSpecies) standSpecies.textContent = `Species: ${caseItem.species}`;
    if (standMugshot) {
      standMugshot.src = caseItem.avatar;
      standMugshot.onerror = () => { standMugshot.src = 'assets/suspect-cat1.svg'; };
    }
    if (standDocket) standDocket.textContent = caseItem.docketNo;
    if (select) select.value = caseItem.id;

    // Reset Evidence tab to Exhibit A
    switchEvidenceTab('A');

    // Hide previous verdict stage when changing cases
    const verdictStage = document.getElementById('verdictRevealStage');
    if (verdictStage) {
      verdictStage.classList.remove('revealed');
    }

    typeStenographerLine(`Bailiff: Case ${caseItem.docketNo} called to the stand. Defendant: ${caseItem.name}.`);
  }

  function setupEvidenceTabs() {
    const tabs = document.querySelectorAll('.evidence-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-tab');
        switchEvidenceTab(tabKey);
      });
    });
  }

  function switchEvidenceTab(tabKey) {
    const tabs = document.querySelectorAll('.evidence-tab-btn');
    const pane = document.getElementById('evidenceContentPane');

    tabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabKey) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    if (!pane || !currentCase) return;

    if (tabKey === 'A') {
      pane.innerHTML = `<strong>Exhibit A (Physical Evidence):</strong> ${currentCase.exhibits?.A || 'Fragmentary debris recovered at crime scene.'}`;
    } else if (tabKey === 'B') {
      pane.innerHTML = `<strong>Exhibit B (Eyewitness Testimony):</strong> ${currentCase.exhibits?.B || currentCase.statement}`;
    } else if (tabKey === 'C') {
      pane.innerHTML = `<strong>Exhibit C (Prior Infractions):</strong> ${currentCase.exhibits?.C || 'Multiple unverified warnings regarding nocturnal chaos.'}`;
    }
  }

  // Live Court Stenographer simulation
  function startStenographer() {
    if (stenographerInterval) clearInterval(stenographerInterval);

    stenographerInterval = setInterval(() => {
      if (Math.random() > 0.45) return;
      const funnyRemarks = [
        `Stenographer: [Defendant ${currentCase.name} attempts to groom paw during proceedings]`,
        `Judge ${currentJudge.name.split(' ')[0]}: "Let the record reflect the court is not amused."`,
        `Bailiff: "Defendant is refusing to look directly at the magistrate."`,
        `Stenographer: [Rustling of treat bag detected from jury gallery]`,
        `Stenographer: [Defendant lets out single high-pitched meow in objection]`
      ];
      const randomLine = funnyRemarks[Math.floor(Math.random() * funnyRemarks.length)];
      typeStenographerLine(randomLine);
    }, 7000);
  }

  function typeStenographerLine(text) {
    const textEl = document.getElementById('stenographerText');
    if (!textEl) return;
    textEl.textContent = text;
  }

  // Interactive Gavel Strike & Verdict Generator
  function setupGavelAction() {
    const gavelBtn = document.getElementById('gavelStrikeBtn');
    const stage = document.querySelector('.courtroom-stage');
    const gavelVisual = document.getElementById('gavelVisual');

    if (!gavelBtn) return;

    gavelBtn.addEventListener('click', () => {
      // 1. Audio and Visual Rumble
      playGavelStrike(true);

      if (gavelVisual) {
        gavelVisual.classList.add('striking');
        setTimeout(() => gavelVisual.classList.remove('striking'), 500);
      }

      if (stage) {
        stage.classList.add('rumble');
        setTimeout(() => stage.classList.remove('rumble'), 450);
      }

      // 2. Generate and Reveal Verdict
      setTimeout(() => {
        deliverVerdict();
        playStampImpact();
      }, 350);
    });

    // Subpoena Certificate Trigger
    const certBtn = document.getElementById('issueCertificateBtn');
    if (certBtn) {
      certBtn.addEventListener('click', () => {
        openCertificateModal();
      });
    }

    // Trial Next Defendant
    const nextBtn = document.getElementById('trialNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const currentIndex = activeCases.findIndex(c => c.id === currentCase.id);
        const nextIndex = (currentIndex + 1) % activeCases.length;
        loadCaseIntoBench(activeCases[nextIndex]);
      });
    }
  }

  function deliverVerdict() {
    const verdictStage = document.getElementById('verdictRevealStage');
    const stamp = document.getElementById('verdictStamp');
    const decreeTitle = document.getElementById('verdictTitle');
    const decreeText = document.getElementById('verdictDecreeText');
    const sentenceText = document.getElementById('verdictSentenceText');

    if (!verdictStage) return;

    // Feline bias: cats are almost always guilty unless Barnaby favors them; dogs vary
    let isGuilty = true;
    if (currentJudge.bias === 'bribe_susceptible' && Math.random() > 0.4) {
      isGuilty = false; // Magistrate Reginald accepts cheese bribes!
    } else if (currentJudge.bias === 'feline_supremacy' && currentCase.category === 'feline' && Math.random() > 0.65) {
      isGuilty = false; // Chief Whiskers rules cat innocent because cat!
    } else {
      isGuilty = true;
    }

    const sentences = [
      'Sentenced to 14 minutes of belly rubs (strictly maximum 2 rubs; 3rd will result in justifiable clawing).',
      'Forfeiture of all canned salmon privileges until the sun sets twice.',
      'Mandatory confinement to the newly arrived Amazon cardboard box for two consecutive naps.',
      '40 hours of supervised laser pointer pursuit with zero probability of capture.',
      'Official reprimand placed on permanent domestic record; required to wear the Cone of Mild Inconvenience for 10 minutes.',
      'Banned from bedroom countertops during culinary meal preparation hours.'
    ];

    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

    if (stamp) {
      stamp.className = 'verdict-stamp ' + (isGuilty ? 'stamp-guilty' : 'stamp-innocent');
      stamp.textContent = isGuilty ? 'GUILTY AS CHARGED' : 'ACQUITTED ON CHARM';
    }

    if (decreeTitle) {
      decreeTitle.textContent = isGuilty
        ? `Official Ruling: High Petty Misdemeanor Confirmed`
        : `Official Ruling: Charges Dismissed Under Cuteness Immunity`;
    }

    if (decreeText) {
      decreeText.textContent = isGuilty
        ? `Presiding ${currentJudge.name} finds ${currentCase.name} conclusively liable for "${currentCase.charge}". The defense's alibi of "${currentCase.defense}" was deemed thoroughly frivolous.`
        : `Presiding ${currentJudge.name} ruled that ${currentCase.name} is simply baby. The prosecution failed to demonstrate that the item fell on purpose.`;
    }

    if (sentenceText) {
      sentenceText.textContent = isGuilty
        ? randomSentence
        : 'Penalty Nullified: Subject released into living room on personal recognizance.';
    }

    verdictStage.classList.add('revealed');
    typeStenographerLine(`Gavel strikes! ${currentJudge.name} has entered an official decree.`);
  }

  // =========================================================================
  // 6. CASE SUBMISSION FORM ("FILE A PETIT PETITION")
  // =========================================================================
  function initSubmissionForm() {
    const form = document.getElementById('petitionForm');
    const presetButtons = document.querySelectorAll('.avatar-preset-btn');
    const avatarInput = document.getElementById('fieldAvatarUrl');

    if (!form) return;

    // Avatar Presets
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        presetButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const imgUrl = btn.getAttribute('data-img');
        if (avatarInput) avatarInput.value = imgUrl;
        updateLiveWarrantPreview();
      });
    });

    // Form inputs live preview binding
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', updateLiveWarrantPreview);
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fieldName')?.value.trim();
      const alias = document.getElementById('fieldAlias')?.value.trim() || 'The Household Phantom';
      const species = document.getElementById('fieldSpecies')?.value || 'Cat';
      const category = document.getElementById('fieldCategory')?.value || 'feline';
      const crime = document.getElementById('fieldCrime')?.value.trim();
      const statement = document.getElementById('fieldStatement')?.value.trim();
      const restitution = document.getElementById('fieldRestitution')?.value.trim() || 'Apology purr and cuddle forfeiture';
      let avatar = document.getElementById('fieldAvatarUrl')?.value.trim();

      if (!name || !crime || !statement) {
        alert('Please fill in all mandatory legal filing fields.');
        return;
      }

      if (!avatar) {
        avatar = 'assets/suspect-cat1.svg';
      }

      const randomId = Math.floor(1000 + Math.random() * 9000);
      const newCase = {
        id: `pc-citizen-${Date.now()}`,
        docketNo: `#PC-2026-${randomId}`,
        name: name,
        alias: alias,
        species: species,
        category: category,
        status: 'ON BAIL',
        statusClass: 'status-citizen',
        avatar: avatar,
        charge: crime,
        statement: statement,
        defense: '"I have done nothing wrong in my life, ever, and I am tiny."',
        exhibits: {
          A: statement,
          B: `Demanded Restitution: ${restitution}`,
          C: 'Citizen incident logged locally via Petty Court docket.'
        },
        guiltyVotes: 1,
        innocentVotes: 0,
        isCitizen: true
      };

      // Add to front of active cases
      activeCases.unshift(newCase);
      saveStoredCases();

      // Audio & UX Feedback
      playGavelStrike(true);

      // Populate into bench
      populateBenchCaseSelector();
      loadCaseIntoBench(newCase);

      // Refresh Docket Gallery
      renderDocketCards();

      // Show celebratory confirmation toast
      showCourtToast(`<strong>CASE DOCKETED!</strong> ${newCase.docketNo} for <strong>${newCase.name}</strong> recorded. Now standing before the bench!`, '⚖️');

      // Reset form
      form.reset();
      presetButtons.forEach((b, i) => {
        if (i === 0) b.classList.add('selected');
        else b.classList.remove('selected');
      });
      updateLiveWarrantPreview();

      // Scroll to courtroom bench so user sees their pet on trial!
      const courtroom = document.getElementById('courtroom');
      if (courtroom) {
        courtroom.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function updateLiveWarrantPreview() {
    const name = document.getElementById('fieldName')?.value.trim() || 'Lord Fluffington';
    const alias = document.getElementById('fieldAlias')?.value.trim() || 'The Midnight Menace';
    const species = document.getElementById('fieldSpecies')?.value || 'Cat (Domestic Short Hair)';
    const crime = document.getElementById('fieldCrime')?.value.trim() || 'Aggravated Countertop Trespass';
    const statement = document.getElementById('fieldStatement')?.value.trim() || 'Stared directly into human soul and tipped over freshly filled water bowl.';
    const avatar = document.getElementById('fieldAvatarUrl')?.value.trim() || 'assets/suspect-cat1.svg';

    const pName = document.getElementById('prevName');
    const pAlias = document.getElementById('prevAlias');
    const pSpecies = document.getElementById('prevSpecies');
    const pCrime = document.getElementById('prevCrime');
    const pStatement = document.getElementById('prevStatement');
    const pImg = document.getElementById('prevMugshotImg');

    if (pName) pName.textContent = name;
    if (pAlias) pAlias.textContent = `"${alias}"`;
    if (pSpecies) pSpecies.textContent = species;
    if (pCrime) pCrime.textContent = crime;
    if (pStatement) pStatement.textContent = statement.length > 90 ? statement.slice(0, 90) + '...' : statement;
    if (pImg) {
      pImg.src = avatar;
      pImg.onerror = () => { pImg.src = 'assets/suspect-cat1.svg'; };
    }
  }

  // =========================================================================
  // 7. HALL OF PETTY FAME & PARDON COUNTERS
  // =========================================================================
  function initHallOfFame() {
    const grid = document.getElementById('hallOfFameGrid');
    if (!grid) return;

    // Load fame votes from local storage
    let fameVotes = {};
    try {
      fameVotes = JSON.parse(localStorage.getItem('petty_fame_votes') || '{}');
    } catch (e) {
      fameVotes = {};
    }

    grid.innerHTML = INITIAL_FAME.map((f, i) => {
      const stored = fameVotes[f.id] || { pardons: f.pardons, sentences: f.sentences };
      const medals = ['👑 MOST NOTORIOUS', '🥈 DISTINGUISHED CHAOS', '🥉 UNAPOLOGETIC BOLDNESS'];

      return `
        <article class="fame-card">
          <div class="fame-laurel-badge">${i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'}</div>
          <div class="fame-mugshot-wrap">
            <img class="fame-mugshot-img" src="${f.avatar}" alt="${f.defendant}">
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--gold-bright); font-weight: 700; margin-bottom: 0.3rem;">${medals[i]}</span>
          <h3 class="fame-card-title">${f.defendant}</h3>
          <div class="fame-card-subtitle">"${f.title}"</div>
          <p class="fame-card-crime">${f.crime}</p>
          <div class="fame-punishment-tag">⚖️ ${f.punishment}</div>

          <div class="fame-actions-row">
            <button class="btn-fame-action" data-action="pardon" data-id="${f.id}">
              ✨ Pardon (<span id="pardon-${f.id}">${stored.pardons}</span>)
            </button>
            <button class="btn-fame-action" data-action="double-sentence" data-id="${f.id}">
              ⛓️ Double Sentence (<span id="sentence-${f.id}">${stored.sentences}</span>)
            </button>
          </div>
        </article>
      `;
    }).join('');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-fame-action');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      const current = fameVotes[id] || { pardons: 500, sentences: 300 };

      if (action === 'pardon') {
        current.pardons++;
        fameVotes[id] = current;
        localStorage.setItem('petty_fame_votes', JSON.stringify(fameVotes));
        const el = document.getElementById(`pardon-${id}`);
        if (el) el.textContent = current.pardons;
        playBailiffChime();
      } else if (action === 'double-sentence') {
        current.sentences += 2;
        fameVotes[id] = current;
        localStorage.setItem('petty_fame_votes', JSON.stringify(fameVotes));
        const el = document.getElementById(`sentence-${id}`);
        if (el) el.textContent = current.sentences;
        playStampImpact();
      }
    });
  }

  // =========================================================================
  // 8. PENAL CODE ACCORDION
  // =========================================================================
  function initPenalCode() {
    const items = document.querySelectorAll('.bylaw-item');
    items.forEach(item => {
      const trigger = item.querySelector('.bylaw-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          items.forEach(i => i.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
            playBailiffChime();
          }
        });
      }
    });
  }

  // =========================================================================
  // 9. PRINTABLE CERTIFICATE MODAL
  // =========================================================================
  function initCertificateModal() {
    const modal = document.getElementById('certModalOverlay');
    const closeBtn = document.getElementById('certModalClose');
    const printBtn = document.getElementById('certPrintBtn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function openCertificateModal() {
    const modal = document.getElementById('certModalOverlay');
    const dName = document.getElementById('certDefendantName');
    const cCharge = document.getElementById('certCharge');
    const jName = document.getElementById('certJudgeName');
    const jSignature = document.getElementById('certJudgeSignature');
    const dateEl = document.getElementById('certDate');

    if (!modal) return;

    if (dName) dName.textContent = currentCase.name;
    if (cCharge) cCharge.textContent = currentCase.charge;
    if (jName) jName.textContent = currentJudge.name;
    if (jSignature) jSignature.textContent = currentJudge.name.split(' ')[0] + ' ' + (currentJudge.name.split(' ')[2] || 'Whiskers');
    if (dateEl) {
      const today = new Date();
      dateEl.textContent = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    modal.classList.add('active');
    playStampImpact();
  }

  // =========================================================================
  // 10. SCROLL REVEAL OBSERVER
  // =========================================================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // =========================================================================
  // DOM READY BOOTSTRAP
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadStoredCases();
    initHeaderControls();
    initDocketGallery();
    initCourtroomBench();
    initSubmissionForm();
    initHallOfFame();
    initPenalCode();
    initCertificateModal();
    initScrollReveal();

    // First user gesture initializes audio context smoothly
    window.addEventListener('click', () => {
      initAudioContext();
    }, { once: true });
  });

})();

