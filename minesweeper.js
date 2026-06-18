/* ==========================================================================
   Minesweeper Game Logic & Rendering
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const gridElement = document.getElementById('minesweeperGrid');
  const difficultySelect = document.getElementById('difficultySelect');
  const smileyBtn = document.getElementById('smileyBtn');
  const mineCounter = document.getElementById('mineCounter');
  const timerElement = document.getElementById('timer');
  const gameOverlay = document.getElementById('gameOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const restartBtn = document.getElementById('restartBtn');
  const flagModeBtn = document.getElementById('flagModeBtn');

  // --- Game Config & State ---
  const difficulties = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 }
  };

  let rows = 9;
  let cols = 9;
  let mineCount = 10;
  let board = [];
  let gameState = 'idle'; // 'idle', 'playing', 'won', 'lost'
  let timerVal = 0;
  let timerInterval = null;
  let flaggedCount = 0;
  let isMobileFlagMode = false;

  // --- Initial Setup ---
  initGame();

  // --- Event Listeners ---
  difficultySelect.addEventListener('change', (e) => {
    initGame(e.target.value);
  });

  smileyBtn.addEventListener('click', () => {
    initGame(difficultySelect.value);
  });

  restartBtn.addEventListener('click', () => {
    initGame(difficultySelect.value);
  });

  // Mobile Flag Mode Toggle
  flagModeBtn.addEventListener('click', () => {
    isMobileFlagMode = !isMobileFlagMode;
    if (isMobileFlagMode) {
      flagModeBtn.classList.add('active');
      flagModeBtn.innerHTML = '<span>🚩</span> 標記模式';
    } else {
      flagModeBtn.classList.remove('active');
      flagModeBtn.innerHTML = '<span>⛏️</span> 挖土模式';
    }
  });

  // --- Game Functions ---

  function initGame(diffKey = 'easy') {
    // Stop existing timer
    clearInterval(timerInterval);
    timerInterval = null;
    timerVal = 0;
    timerElement.textContent = '000';
    
    // Set Config
    const config = difficulties[diffKey];
    rows = config.rows;
    cols = config.cols;
    mineCount = config.mines;
    
    gameState = 'idle';
    flaggedCount = 0;
    updateMineCounter();
    smileyBtn.textContent = '🙂';
    gameOverlay.classList.remove('active');

    // Reset Mobile Flag Mode
    isMobileFlagMode = false;
    flagModeBtn.classList.remove('active');
    flagModeBtn.innerHTML = '<span>⛏️</span> 挖土模式';

    // Clear board container
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 32px)`;
    gridElement.style.gridTemplateRows = `repeat(${rows}, 32px)`;

    // Create Board Structure
    board = [];
    for (let r = 0; r < rows; r++) {
      board[r] = [];
      for (let c = 0; c < cols; c++) {
        const cell = {
          row: r,
          col: c,
          isMine: false,
          revealed: false,
          flagged: false,
          neighborMines: 0,
          element: null
        };
        
        // Create DOM element
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('minesweeper-cell');
        cellDiv.dataset.row = r;
        cellDiv.dataset.col = c;
        
        // Add events
        cellDiv.addEventListener('click', (e) => handleCellClick(r, c));
        cellDiv.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          handleCellRightClick(r, c);
        });

        gridElement.appendChild(cellDiv);
        cell.element = cellDiv;
        board[r][c] = cell;
      }
    }
  }

  // Generate Mines after first click to guarantee first click is safe
  function generateMines(startRow, startCol) {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Do not place mine on the starting cell or its direct 8 neighbors
      const isStartArea = Math.abs(r - startRow) <= 1 && Math.abs(c - startCol) <= 1;

      if (!board[r][c].isMine && !isStartArea) {
        board[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors count
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!board[r][c].isMine) {
          board[r][c].neighborMines = countNeighborMines(r, c);
        }
      }
    }
  }

  function countNeighborMines(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (isValidCell(nr, nc) && board[nr][nc].isMine) {
          count++;
        }
      }
    }
    return count;
  }

  function isValidCell(r, c) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
  }

  // Timer Control
  function startTimer() {
    timerInterval = setInterval(() => {
      timerVal++;
      if (timerVal > 999) timerVal = 999;
      timerElement.textContent = String(timerVal).padStart(3, '0');
    }, 1000);
  }

  function updateMineCounter() {
    const remaining = mineCount - flaggedCount;
    const absVal = Math.abs(remaining);
    const text = String(absVal).padStart(3, '0');
    mineCounter.textContent = remaining < 0 ? `-${text.slice(-2)}` : text;
  }

  // --- Click Handlers ---

  function handleCellClick(r, c) {
    if (gameState === 'won' || gameState === 'lost') return;

    const cell = board[r][c];

    // Mobile flag mode toggle
    if (isMobileFlagMode) {
      handleCellRightClick(r, c);
      return;
    }

    // Normal click flow
    if (cell.flagged || cell.revealed) return;

    // First click logic
    if (gameState === 'idle') {
      gameState = 'playing';
      generateMines(r, c);
      startTimer();
    }

    if (cell.isMine) {
      gameOver(cell);
    } else {
      revealCell(r, c);
      checkWinCondition();
    }
  }

  function handleCellRightClick(r, c) {
    if (gameState === 'won' || gameState === 'lost') return;
    if (gameState === 'idle') {
      // Allow flagging before first click, start game but no mines here yet
      gameState = 'playing';
      generateMines(r, c);
      startTimer();
    }

    const cell = board[r][c];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    if (cell.flagged) {
      cell.element.classList.add('flagged');
      cell.element.innerHTML = '🚩';
      flaggedCount++;
    } else {
      cell.element.classList.remove('flagged');
      cell.element.innerHTML = '';
      flaggedCount--;
    }
    updateMineCounter();
  }

  // --- Core Reveal Cell Logic ---

  function revealCell(r, c) {
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    cell.element.classList.add('revealed');

    if (cell.neighborMines > 0) {
      cell.element.textContent = cell.neighborMines;
      cell.element.classList.add(`cell-${cell.neighborMines}`);
    } else {
      // It's empty, reveal neighbors recursively
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (isValidCell(nr, nc)) {
            revealCell(nr, nc);
          }
        }
      }
    }
  }

  // --- Win / Loss States ---

  function checkWinCondition() {
    let revealedCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].revealed) revealedCount++;
      }
    }

    // Win condition: all non-mine cells revealed
    if (revealedCount === (rows * cols) - mineCount) {
      gameState = 'won';
      clearInterval(timerInterval);
      smileyBtn.textContent = '😎';
      
      // Auto flag all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (board[r][c].isMine && !board[r][c].flagged) {
            board[r][c].flagged = true;
            board[r][c].element.classList.add('flagged');
            board[r][c].element.innerHTML = '🚩';
          }
        }
      }
      flaggedCount = mineCount;
      updateMineCounter();

      // Show win overlay
      showOverlay(true);
    }
  }

  function gameOver(explodedCell) {
    gameState = 'lost';
    clearInterval(timerInterval);
    smileyBtn.textContent = '😵';

    // Reveal all mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = board[r][c];
        if (cell.isMine) {
          cell.element.classList.add('mine');
          if (cell === explodedCell) {
            cell.element.classList.add('mine-exploded');
            cell.element.innerHTML = '💥';
          } else if (!cell.flagged) {
            cell.element.innerHTML = '💣';
          }
        } else if (cell.flagged) {
          // Flagged incorrect mine
          cell.element.innerHTML = '❌';
        }
      }
    }

    // Show lose overlay
    showOverlay(false);
  }

  function showOverlay(isWin) {
    overlayTitle.textContent = isWin ? '恭喜通關！' : '踩到地雷了！';
    overlayTitle.className = isWin ? 'overlay-title win' : 'overlay-title lose';
    overlayText.textContent = isWin 
      ? `您成功避開了所有地雷，花費時間：${timerVal} 秒！` 
      : '再接再厲，調整好心情後重新開始吧。';
    
    // Smooth delay before showing overlay
    setTimeout(() => {
      gameOverlay.classList.add('active');
    }, 500);
  }
});
