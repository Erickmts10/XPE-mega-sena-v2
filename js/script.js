var state = { board: [], currentGame: [], savedGames: [] };

function start() {
  readLocalStorage();
  createBoard();
  newGame();
}

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savadGamesFromLocalStorage = window.localStorage.getItem('saved-games');

  if (savadGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savadGamesFromLocalStorage);
  }
}

function writeToLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createBoard() {
  state.board = [];

  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function newGame() {
  resetGame();
  render();
}

function render() {
  renderBoard();
  renderButtons();
  renderSavedGames();
}

function renderBoard() {
  var divBoard = document.querySelector('#megasena-board');
  divBoard.innerHTML = '';

  var ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];

    var liNumber = document.createElement('li');
    liNumber.textContent = currentNumber;
    liNumber.classList.add('number');

    liNumber.addEventListener('click', handleNumberClick);

    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add('selected-number');
    }

    ulNumbers.appendChild(liNumber);
  }

  divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);

  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }

  render();
}

function renderButtons() {
  var divButtons = document.querySelector('#megasena-button');
  divButtons.innerHTML = '';

  var buttonNewGame = createNewGameButton();
  var buttonRandomGame = createRandomGameButton();
  var buttonSaveGame = createSaveGameButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSaveGame);
}

function createRandomGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Jogo aleat??rio';

  button.addEventListener('click', RandomGame);

  return button;
}

function createNewGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Novo jogo';

  button.addEventListener('click', newGame);

  return button;
}

function createSaveGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Salvar jogo';
  button.disabled = !IsGameComplete();

  button.addEventListener('click', saveGame);

  return button;
}

function renderSavedGames() {
  var divSavedGames = document.querySelector('#megasena-saved-game');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nunhum jogo salvo</p>';
  } else {
    var ulSavedGames = document.createElement('ul');

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      var liGame = document.createElement('li');
      liGame.textContent = currentGame.join(', ');

      ulSavedGames.appendChild(liGame);
    }

    divSavedGames.appendChild(ulSavedGames);
  }
}

function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error('Numero invalido', numberToAdd);
    return;
  }

  if (state.currentGame.length >= 6) {
    console.error('O jogo j?? est?? completo');
    return;
  }

  if (isNumberInGame(numberToAdd)) {
    console.error('Este n??mero j?? esta no jogo.', numberToAdd);
  }

  state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error('Numero invalido', numberToRemove);
    return;
  }

  var newGame = [];

  for (var i = 0; i < state.currentGame.length; i++) {
    var currentNumbe = state.currentGame[i];

    if (currentNumbe === numberToRemove) {
      continue;
    }

    newGame.push(currentNumbe);
  }

  state.currentGame = newGame;
}

function isNumberInGame(numberToCheck) {
  // if (state.currentGame.includes(numberToCheck)) {
  //   return true;
  // }

  // return false;

  return state.currentGame.includes(numberToCheck);
}

function saveGame() {
  if (!IsGameComplete()) {
    console.error('O jogo n??o est?? completo');
    return;
  }
  state.savedGames.push(state.currentGame);
  writeToLocalStorage();
  newGame();
}

function IsGameComplete() {
  return state.currentGame.length === 6;
}

function resetGame() {
  state.currentGame = [];
}

function RandomGame() {
  resetGame();

  while (!IsGameComplete()) {
    var randomNumero = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumero);
  }

  render();
}

start();
render();
