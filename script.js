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
