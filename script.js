/* eslint-disable radix */
/* eslint-disable no-use-before-define */
// controls actions unique to each player
const playerFactory = (playerID) => ({ playerID });

// controls array of x's and o's
const gameBoard = (() => {
  let board = [['', '', ''], ['', '', ''], ['', '', '']];

  const newGame = () => {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
  };
  const writePosition = (playerID, row, col) => {
    if (board[row][col] === '') {
      board[row][col] = playerID;
      return true;
    }
    return false;
  };
  const checkWin = (row, col) => {
    if (board[row][0] === board[row][1] && board[row][0] === board[row][2]) { return true; }
    if (board[0][col] === board[1][col] && board[0][col] === board[2][col]) { return true; }
    if (row === col && board[0][0] === board[1][1] && board[0][0] === board[2][2]) { return true; }
    if (
      row + col === 2 && board[0][2] === board[1][1] && board[0][2] === board[2][0]
    ) { return true; }
    return false;
  };
  const checkTie = () => {
    if (!board[0].includes('') && !board[1].includes('') && !board[2].includes('')) {
      return true;
    }
    return false;
  };
  return {
    board,
    newGame,
    writePosition,
    checkWin,
    checkTie,
  };
})();

// controls flow of game logic
const gameController = (() => {
  const playerX = playerFactory('X');
  const playerO = playerFactory('O');
  let activePlayer = playerX;

  const newGame = () => {
    gameBoard.newGame();
    activePlayer = playerX;
  };
  const switchPlayer = () => {
    if (activePlayer === playerX) { activePlayer = playerO; } else { activePlayer = playerX; }
    gameDisplay.updateDirection(activePlayer.playerID, false);
  };
  const selectSquare = (row, col) => {
    gameDisplay.updateSquare(row, col, activePlayer.playerID);
    gameBoard.writePosition(activePlayer.playerID, row, col);
    if (gameBoard.checkWin(row, col)) {
      win();
    } else if (gameBoard.checkTie()) {
      tie();
    } else { switchPlayer(); }
  };
  function win() {
    gameDisplay.win(activePlayer.playerID);
  }
  function tie() {
    gameDisplay.tie(activePlayer.playerID);
  }

  return {
    newGame,
    switchPlayer,
    selectSquare,
  };
})();

// uses game logic to effect display of game
const gameDisplay = (() => {
  const gameSetup = () => {
    const allGridSquares = document.querySelectorAll('.board-square');
    allGridSquares.forEach((square) => {
      square.classList.remove('ex');
      square.classList.remove('oh');
      square.classList.add('empty');
      square.addEventListener('click', squareClick);
    });
  };
  function squareClick(event) {
    const row = parseInt(event.target.id[0]);
    const col = parseInt(event.target.id[2]);
    gameController.selectSquare(row, col);
    event.target.removeEventListener('click', squareClick);
  }
  const updateSquare = (row, col, player) => {
    const gridSquare = document.getElementById(`${row}-${col}`);
    gridSquare.classList.remove('empty');
    if (player === 'X') {
      gridSquare.classList.add('ex');
    } else if (player === 'O') {
      gridSquare.classList.add('oh');
    }
  };
  const updateDirection = (playerID, type) => {
    const directionBlurb = document.querySelector('.information');
    let player = '1';
    if (playerID === 'O') { player = '2'; }

    if (type === 'win') {
      directionBlurb.textContent = `Player ${player} wins!`;
    } else if (type === 'tie') {
      directionBlurb.textContent = 'It\'s a tie!';
    } else {
      directionBlurb.textContent = `Player ${player}'s turn!`;
    }
  };
  function activateButton() {
    const buttonElement = document.querySelector('button');
    buttonElement.classList.add('active');
    buttonElement.addEventListener('click', buttonNewGame);
  }
  function buttonNewGame(event) {
    gameController.newGame();
    gameDisplay.gameSetup();
    event.target.removeEventListener('click', buttonNewGame);
    event.target.classList.remove('active');
    updateDirection('X', false);
  }
  const win = (playerID) => {
    // Remove event listeners so no one can pick more squaraes
    const allGridSquares = document.querySelectorAll('.board-square');
    allGridSquares.forEach((square) => {
      square.removeEventListener('click', squareClick);
    });
    // Update blurb to say who won
    updateDirection(playerID, 'win');
    // Show button to start new game
    activateButton();
  };
  const tie = (playerID) => {
    // Update blurb to say who won
    updateDirection(playerID, 'tie');
    // Show button to start new game
    activateButton();
  };
  return {
    gameSetup,
    updateSquare,
    updateDirection,
    win,
    tie,
  };
})();

gameDisplay.gameSetup();
