const gameData = {
	level: 1,
	growth: 1,
	pH: 7.0,
	bees: false,
	treeType: undefined,
	infested: false,
	fertilizer: 0,
  coins: 100,
  grafted: false,
  pruneNum: 0,
  pruneMax: [0, 0, 3, 5, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8],
  baseFruit: [0, 40, 55, 80, 85, 90, 95, 100, 100, 105, 110, 110, 115, 120],
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
