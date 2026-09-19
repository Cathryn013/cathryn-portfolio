// Bright Minds - shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    // Close menu when a link is tapped (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // Resource filter pills (resources.html)
  var pills = document.querySelectorAll('.filter-pill');
  var cards = document.querySelectorAll('[data-category]');
  if (pills.length && cards.length) {
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        var category = pill.getAttribute('data-filter');
        cards.forEach(function (card) {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Simple client-side search on resources page
  var searchInput = document.querySelector('.search-bar input');
  if (searchInput && cards.length) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = text.indexOf(q) > -1 ? '' : 'none';
      });
    });
  }

  // About page: presentation cards (styled like the Resources page cards)
  // open a shared modal to play their video. Only one video is ever
  // mounted at a time, since there's only ever one modal.
  var videoModal = document.getElementById('videoModal');
  var presentationCards = document.querySelectorAll('.presentation-card');
  if (videoModal && presentationCards.length) {
    var modalStage = document.getElementById('modalVideoStage');
    var modalTitle = document.getElementById('modalVideoTitle');
    var modalCredit = document.getElementById('modalVideoCredit');

    function openVideoModal(card) {
      var src = card.getAttribute('data-embed-src');
      var titleText = card.querySelector('h3').textContent;
      var creditHref = card.getAttribute('data-credit-href');
      var creditText = card.getAttribute('data-credit-text');
      modalTitle.textContent = titleText;
      modalStage.innerHTML = '<iframe loading="lazy" src="' + src + '" allow="fullscreen" allowfullscreen title="' + titleText + '"></iframe>';
      modalCredit.innerHTML = '<a href="' + creditHref + '" target="_blank" rel="noopener">' + creditText + '</a> by Cathryn Emily Herrera';
      videoModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
      videoModal.hidden = true;
      modalStage.innerHTML = ''; // stop playback
      document.body.style.overflow = '';
    }

    presentationCards.forEach(function (card) {
      card.addEventListener('click', function () {
        openVideoModal(card);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openVideoModal(card);
        }
      });
    });

    videoModal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeVideoModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !videoModal.hidden) closeVideoModal();
    });
  }

  // Home page: Wordle mini-game for guests
  var wordleModal = document.getElementById('wordleModal');
  if (wordleModal) {
    var ANSWER_WORDS = ["TEACH", "LEARN", "BOOKS", "CHALK", "GRADE", "STUDY", "CLASS", "DESKS", "NOTES", "EXAMS", "SKILL", "IDEAS", "MEDIA", "ADAPT", "SHARE", "GUIDE", "MODEL", "DRILL", "TEXTS", "WORDS", "BRAIN", "FOCUS", "STAGE", "LEVEL", "TERMS", "TOPIC", "QUOTE", "SPARK", "CRAFT", "BUILD", "VALUE", "TRAIN", "COACH", "SHAPE", "STORY", "WRITE", "READS"];
    var ALLOWED_GUESSES = ["ABOUT", "ABOVE", "ACTOR", "ADAPT", "AFTER", "AGAIN", "AGENT", "AGREE", "AHEAD", "ALARM", "ALIKE", "ALIVE", "ALLOW", "ALONE", "ALONG", "ALTER", "ANGRY", "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AVOID", "AWAKE", "AWARD", "AWARE", "BADLY", "BASIC", "BEACH", "BEGAN", "BEGIN", "BEING", "BELOW", "BENCH", "BIRTH", "BLAME", "BLANK", "BLAST", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOAST", "BONUS", "BOOKS", "BOUND", "BRAIN", "BRAND", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD", "BROWN", "BUILD", "BUYER", "CABLE", "CARRY", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHALK", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLOCK", "CLOSE", "COACH", "COAST", "COULD", "COUNT", "COURT", "COVER", "CRAFT", "CRASH", "CRAZY", "CREAM", "CRIME", "CROSS", "CROWD", "CROWN", "CURVE", "CYCLE", "DAILY", "DANCE", "DEATH", "DELAY", "DEPTH", "DESKS", "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRANK", "DRAWN", "DREAM", "DRESS", "DRILL", "DRINK", "DRIVE", "DROVE", "DYING", "EAGER", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY", "EXACT", "EXAMS", "EXIST", "EXTRA", "FAITH", "FALSE", "FAULT", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIXED", "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK", "FRESH", "FRONT", "FROST", "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE", "GOING", "GRACE", "GRADE", "GRAND", "GRANT", "GRASS", "GREAT", "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY", "HARSH", "HEART", "HEAVY", "HELLO", "HENCE", "HORSE", "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IDEAS", "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE", "JOINT", "JUDGE", "KNOWN", "LABEL", "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEAST", "LEAVE", "LEGAL", "LEMON", "LEVEL", "LIGHT", "LIMIT", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LOYAL", "LUCKY", "LUNCH", "MAGIC", "MAJOR", "MAKER", "MARCH", "MATCH", "MAYBE", "MAYOR", "MEANT", "MEDAL", "MEDIA", "MERIT", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NEEDS", "NERVE", "NEVER", "NIGHT", "NOISE", "NORTH", "NOTES", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER", "OTHER", "OUGHT", "OUTER", "OWNER", "PANEL", "PAPER", "PARTY", "PEACE", "PHASE", "PHONE", "PHOTO", "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE", "QUEEN", "QUICK", "QUIET", "QUITE", "QUOTE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO", "REACH", "READS", "READY", "REALM", "REBEL", "REFER", "RELAX", "REPLY", "RIGHT", "RIVAL", "RIVER", "ROBOT", "ROMAN", "ROUGH", "ROUND", "ROUTE", "ROYAL", "RURAL", "SAFER", "SALAD", "SAUCE", "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHALL", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK", "SHOOT", "SHORT", "SHOWN", "SIGHT", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE", "SMOKE", "SOLAR", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE", "SPARE", "SPARK", "SPEAK", "SPEED", "SPEND", "SPENT", "SPLIT", "SPOKE", "SPORT", "SQUAD", "STAFF", "STAGE", "STAKE", "STAND", "START", "STATE", "STEAM", "STEEL", "STICK", "STILL", "STOCK", "STONE", "STORE", "STORM", "STORY", "STRIP", "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR", "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH", "TERMS", "TEXTS", "THANK", "THEME", "THERE", "THESE", "THICK", "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "TIGHT", "TIMES", "TIRED", "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE", "TRAIN", "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES", "TRUCK", "TRULY", "TRUST", "TRUTH", "TWICE", "UNDER", "UNION", "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN", "USAGE", "USUAL", "VALID", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL", "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WOMAN", "WORDS", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WRITE", "WRONG", "WROTE", "YOUNG", "YOUTH"];
    var ALLOWED_SET = {};
    ALLOWED_GUESSES.forEach(function (w) { ALLOWED_SET[w] = true; });

    var wordleIntro = document.getElementById('wordleIntro');
    var wordleGame = document.getElementById('wordleGame');
    var wordleBoard = document.getElementById('wordleBoard');
    var wordleKeyboard = document.getElementById('wordleKeyboard');
    var wordleMessage = document.getElementById('wordleMessage');
    var wordleAgainBtn = document.getElementById('wordleAgainBtn');
    var wordlePlayBtn = document.getElementById('wordlePlayBtn');
    var wordleSkipBtn = document.getElementById('wordleSkipBtn');
    var wordleFab = document.getElementById('wordleFab');

    var wSecret = '';
    var wRow = 0;
    var wGuess = '';
    var wOver = false;
    var wTiles = [];
    var wKeyEls = {};

    function openWordleModal() {
      wordleModal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (wordleFab) wordleFab.style.display = 'none';
    }
    function closeWordleModal() {
      wordleModal.hidden = true;
      document.body.style.overflow = '';
      if (wordleFab) wordleFab.style.display = '';
    }

    function buildBoard() {
      wordleBoard.innerHTML = '';
      wTiles = [];
      for (var r = 0; r < 6; r++) {
        var rowEl = document.createElement('div');
        rowEl.className = 'wordle-row';
        var rowTiles = [];
        for (var c = 0; c < 5; c++) {
          var tile = document.createElement('div');
          tile.className = 'wordle-tile';
          rowEl.appendChild(tile);
          rowTiles.push(tile);
        }
        wordleBoard.appendChild(rowEl);
        wTiles.push(rowTiles);
      }
    }

    function buildKeyboard() {
      wordleKeyboard.innerHTML = '';
      wKeyEls = {};
      var rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
      ];
      rows.forEach(function (keys) {
        var rowEl = document.createElement('div');
        rowEl.className = 'wordle-kb-row';
        keys.forEach(function (key) {
          var btn = document.createElement('button');
          btn.type = 'button';
          var isWide = key === 'ENTER' || key === 'BACKSPACE';
          btn.className = 'wordle-key' + (isWide ? ' wide' : '');
          btn.textContent = key === 'BACKSPACE' ? '⌫' : (key === 'ENTER' ? 'Enter' : key);
          btn.setAttribute('data-key', key);
          btn.addEventListener('click', function () { handleKey(key); });
          rowEl.appendChild(btn);
          if (!isWide) wKeyEls[key] = btn;
        });
        wordleKeyboard.appendChild(rowEl);
      });
    }

    function setMessage(text) {
      wordleMessage.textContent = text;
    }

    function initGame() {
      wSecret = ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
      wRow = 0;
      wGuess = '';
      wOver = false;
      buildBoard();
      buildKeyboard();
      setMessage('Guess the 5-letter word in 6 tries!');
      wordleAgainBtn.hidden = true;
    }

    function updateCurrentRow() {
      var tiles = wTiles[wRow];
      for (var i = 0; i < 5; i++) {
        var letter = wGuess[i] || '';
        tiles[i].textContent = letter;
        tiles[i].classList.toggle('filled', !!letter);
      }
    }

    function addLetter(letter) {
      if (wOver || wGuess.length >= 5) return;
      wGuess += letter;
      updateCurrentRow();
      var tile = wTiles[wRow][wGuess.length - 1];
      tile.classList.add('pop');
      setTimeout(function () { tile.classList.remove('pop'); }, 150);
    }

    function deleteLetter() {
      if (wOver || wGuess.length === 0) return;
      wGuess = wGuess.slice(0, -1);
      updateCurrentRow();
    }

    function shakeRow() {
      var rowEl = wordleBoard.children[wRow];
      rowEl.classList.add('shake');
      setTimeout(function () { rowEl.classList.remove('shake'); }, 300);
    }

    function setKeyStatus(letter, status) {
      var el = wKeyEls[letter];
      if (!el) return;
      var rank = { absent: 1, present: 2, correct: 3 };
      var current = el.className.indexOf('correct') > -1 ? 'correct' : (el.className.indexOf('present') > -1 ? 'present' : (el.className.indexOf('absent') > -1 ? 'absent' : ''));
      if (current && rank[current] >= rank[status]) return;
      el.classList.remove('correct', 'present', 'absent');
      el.classList.add(status);
    }

    function submitGuess() {
      if (wOver) return;
      if (wGuess.length !== 5) {
        setMessage('Not enough letters');
        shakeRow();
        return;
      }
      if (!ALLOWED_SET[wGuess]) {
        setMessage('Not in word list');
        shakeRow();
        return;
      }

      var secretArr = wSecret.split('');
      var guessArr = wGuess.split('');
      var result = new Array(5).fill('absent');
      var remaining = {};

      for (var i = 0; i < 5; i++) {
        if (guessArr[i] === secretArr[i]) {
          result[i] = 'correct';
        } else {
          remaining[secretArr[i]] = (remaining[secretArr[i]] || 0) + 1;
        }
      }
      for (var j = 0; j < 5; j++) {
        if (result[j] !== 'correct') {
          var ch = guessArr[j];
          if (remaining[ch] > 0) {
            result[j] = 'present';
            remaining[ch]--;
          }
        }
      }

      var tiles = wTiles[wRow];
      for (var k = 0; k < 5; k++) {
        tiles[k].classList.add(result[k]);
        setKeyStatus(guessArr[k], result[k]);
      }

      if (wGuess === wSecret) {
        wOver = true;
        setMessage('🎉 You got it in ' + (wRow + 1) + '!');
        wordleAgainBtn.hidden = false;
      } else if (wRow === 5) {
        wOver = true;
        setMessage('So close! The word was ' + wSecret + '.');
        wordleAgainBtn.hidden = false;
      } else {
        wRow++;
        wGuess = '';
        setMessage('Guess the 5-letter word in 6 tries!');
      }
    }

    function handleKey(key) {
      if (wordleGame.hidden) return;
      if (key === 'ENTER') {
        submitGuess();
      } else if (key === 'BACKSPACE') {
        deleteLetter();
      } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
      }
    }

    if (wordlePlayBtn) {
      wordlePlayBtn.addEventListener('click', function () {
        wordleIntro.hidden = true;
        wordleGame.hidden = false;
        initGame();
      });
    }
    if (wordleSkipBtn) {
      wordleSkipBtn.addEventListener('click', closeWordleModal);
    }
    if (wordleAgainBtn) {
      wordleAgainBtn.addEventListener('click', initGame);
    }
    if (wordleFab) {
      wordleFab.addEventListener('click', openWordleModal);
    }
    wordleModal.querySelectorAll('[data-wordle-close]').forEach(function (el) {
      el.addEventListener('click', closeWordleModal);
    });
    document.addEventListener('keydown', function (e) {
      if (wordleModal.hidden) return;
      if (e.key === 'Escape') {
        closeWordleModal();
        return;
      }
      if (wordleGame.hidden) return;
      if (e.key === 'Enter') {
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    });

  }

  // Contact form: friendly placeholder submit handling
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // Only intercept if the form has no real action configured yet.
      var action = contactForm.getAttribute('action') || '';
      if (action.indexOf('formspree.io') === -1 && action.indexOf('http') !== 0) {
        e.preventDefault();
        var status = contactForm.querySelector('.form-status');
        if (status) {
          status.textContent = "Thanks for your message! (Connect this form to Formspree or another form service to start receiving submissions, see the README.)";
          status.style.display = 'block';
        }
        contactForm.reset();
      }
    });
  }
});
