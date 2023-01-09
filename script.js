/* eslint-disable no-use-before-define */
// controls actions unique to each player
const playerFactory = (playerID) => {
  const playPosition = (row, col) => {
    if (gameBoard.playPosition(playerID, row, col)) {
      if (gameBoard.checkWin(row, col)) {
        win();
      }
      return true;
    }
    return false;
  };
  const win = () => {
    console.log(`Player ${playerID} wins!!`);
  };
  return {
    playerID, playPosition, win,
  };
};

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
  return {
    board,
    newGame,
    writePosition,
    checkWin,
  };
})();

// controls flow of game logic
const gameController = (() => {
  const playerX = playerFactory('X');
  const playerO = playerFactory('O');
  let activePlayer = playerX;

  const switchPlayer = () => {
    if (activePlayer === playerX) { activePlayer = playerO; } else { activePlayer = playerX; }
  };

  return {
    switchPlayer,
  };
})();

// uses game logic to effect display of game
const gameDisplay = (() => {

})();
