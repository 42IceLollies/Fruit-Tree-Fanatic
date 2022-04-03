const gameData = {
	example: 4
}

// =============== save data functions ===============

// saves the data object values to localStorage
function saveData() {
	for (const key in gameData) {
  	localStorage.setItem(`${key}`, gameData[key]);
  }
}

// pulls the info from localStorage when loading a saved game
function retrieveData() {
	for (const key in gameData) {
  	gameData[`${key}`] = localStorage.getItem(`${key}`);
  	gameData[`${key}`] = localStorage.getItem(`${key}`);
  }
}

// clears the saved data from localStorage
function clearData() {
	for (const key in gameData) {
  		localStorage.deleteItem(`${key}`);
  }
}

// =========== ===========

// changes the pH level
function adjustPH(change) {
	gameData.pH = parseFloat(gameData.pH);
	if (gameData.pH > 6 && gameData.pH < 8) {
		if (change == '+') gameData.pH += 0.1;
		if (change == '-') gameData.pH -= 0.1;
    gameData.pH = Math.round(gameData.pH * 10) / 10;
	} else {
		if (change == '+') gameData.pH += 0.01;
		if (change == '-') gameData.pH -= 0.01;
    gameData.pH = Math.round(gameData.pH * 100) / 100;
	}
  saveData();
}
