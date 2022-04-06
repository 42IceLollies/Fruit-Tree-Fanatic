const gameData = {
  level: 1,
  growth: 0,
  pH: 7.0,
  bees: false,
  treeType: "unselected",
  infested: false,
  lastLevelInfested: 0,
  fertilizer: 0,
  coins: 100,
  grafted: false,
  graftedTreeType: "unselected",
  pruneNum: 0,
  pruneMax: [0, 0, 3, 5, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8],
  baseFruit: [0, 40, 55, 80, 85, 90, 95, 100, 100, 105, 110, 110, 115, 120],
  coinYield: 0,
};

// =============== save data functions ===============

// saves the data object values to localStorage
function saveData() {
  for (const key in gameData) {
    localStorage.setItem(`${key}`, gameData[key]);
  }
}

// pulls the info from localStorage when loading a saved game, and converts to original types
function retrieveData() {
  const toNum = [
    "coins",
    "fertilizer",
    "growth",
    "level",
    "pH",
    "pruneNum",
    "coinYield",
    "lastLevelInfested",
  ];
  const toArray = ["baseFruit", "pruneMax"];
  const toBoolean = ["bees", "grafted", "infested"];
  for (const key in gameData) {
    gameData[`${key}`] = localStorage.getItem(`${key}`);
    gameData[`${key}`] = localStorage.getItem(`${key}`);
  }
  toNum.forEach((num) => {
    gameData[`${num}`] = parseFloat(gameData[`${num}`]);
  });
  toArray.forEach((array) => {
    const strArray = gameData[`${array}`].split(",");
    const numArray = strArray.map((str) => Number(str));
    gameData[`${array}`] = numArray;
  });
  toBoolean.forEach((boolean) => {
    gameData[`${boolean}`] = JSON.parse(gameData[`${boolean}`]);
  });
}

// clears the saved data from localStorage
function clearData() {
  for (const key in gameData) {
    localStorage.removeItem(`${key}`);
  }
}

// =========== mathematical functions ===========

// changes the pH level
function adjustPH(change) {
  gameData.pH = parseFloat(gameData.pH);
  if (gameData.pH > 6 && gameData.pH < 8) {
    if (change == "+") gameData.pH += 0.1;
    if (change == "-") gameData.pH -= 0.1;
    gameData.pH = Math.round(gameData.pH * 10) / 10;
  } else {
    if (change == "+") gameData.pH += 0.01;
    if (change == "-") gameData.pH -= 0.01;
    gameData.pH = Math.round(gameData.pH * 100) / 100;
  }
  saveData();
}

// randomly decides if you get an insect infestation
// to be called every time player advances a level
function determineInfestation() {
  if (gameData.level < 4 || gameData.level > 13) return;
  if (gameData.infested == true) return;
  let chance;
  // 10% for apple trees
  if (gameData.treeType == "apple") chance = 10;
  // 20% for peach trees
  if (gameData.treeType == "peach") chance = 20;
  // 30% for lemon trees
  if (gameData.treeType == "lemon") chance = 30;
  // if the tree was infested last round, halve the chance
  if (gameData.lastLevelInfested == gameData.level - 1) chance /= 2;
  const percent = Math.random() * 100;
  if (percent <= chance) {
    gameData.infested = true;
    gameData.lastLevelInfested = gameData.level;
  }
}

// determines how much the tree grows based on the amount of fertilizer purchased and the level
// to be run before level and fertilizer are updated
function determineGrowth() {
  // for 1st and 2nd level, 0.02
  if (gameData.level == 1 || gameData.level == 2)
    gameData.growth += gameData.fertilizer * 0.02;
  // for 3rd through 5th, 0.01
  if (gameData.level >= 3 && gameData.level <= 5)
    gameData.growth += gameData.fertilizer * 0.01;
  // from then on, 0.005
  if (gameData.level > 5) gameData.growth += gameData.fertilizer * 0.005;
}

// determines the fruit yield at the beginning of each level
// to be run after level has been updated and growth from fertilizer has been determined, but no other data has been changed
// incomplete
function determineYield() {
  // without bees, the pollinationRate could reduce yield by up to 5%
  let pollinationRate = Math.round((0 - Math.random() / 20) * 100) / 100;
  if (gameData.bees) {
    pollinationRate = 0.5;
  }
  let pruneMult = 0;
  if (gameData.level > 1) {
    const pruneFraction =
      gameData.pruneMax[gameData.level - 2] / gameData.pruneNum;
    // if pruned to fullest extent, 10% is added
    let pruneMult = 0.1 * pruneFraction;
  }
  let result =
    gameData.baseFruit[gameData.level - 1] *
    (1 + pollinationRate + gameData.growth + pruneMult);
  result = Math.round(result);
  /* console.log([pollinationRate, gameData.growth, pruneMult, result]) */
}

// =========== purchase functions ===========

function buyFertilizer() {
  if (gameData.coins >= 10) {
    gameData.coins -= 10;
    gameData.fertilizer++;
    // lower the pH
    adjustPH("-");
  }
}

function buyLimestone() {
  if (gameData.coins >= 10) {
    gameData.coins -= 10;
    // raise the pH
    adjustPH("+");
  }
}

function buyPrune() {
  if (
    gameData.coins >= 15 &&
    gameData.pruneNum < gameData.pruneMax[gameData.level - 1]
  ) {
    gameData.coins -= 15;
    gameData.pruneNum++;
  }
}

function buyBees() {
  // can't buy bees if there's an infestation, or if it was infested this level
  if (gameData.infested || gameData.lastLevelInfested == gameData.level) return;
  // a third of the coin yield, rounded to the nearest 5
  const beePrice = Math.round(gameData.coinYield / 3 / 5) * 5;
  if (gameData.coins >= beePrice) {
    gameData.coins -= beePrice;
    gameData.bees = true;
  }
}

function buyRepellent() {
  // can't buy it if there's no infestation
  if (!gameData.infested) return;
  const repellentPrice = Math.round(gameData.coinYield / 2 / 5) * 5;
  console.log(repellentPrice);
  if (gameData.coins >= repellentPrice) {
    gameData.coins -= repellentPrice;
    gameData.infested = false;
  }
}

function buyGraft() {
  // can't buy until level 7
  if (gameData.level < 7) return;
  // the price is the coins value from 100 fruit
  let graftPrice = 100;
  if (gameData.treeType == "peach") graftPrice *= 2;
  if (gameData.treeType == "lemon") graftPrice *= 3;

  if (gameData.coins >= graftPrice) {
    gameData.coins -= graftPrice;
    gameData.grafted = true;
    // determine the grafted type based on the tree type
    if (gameData.treeType == "apple") gameData.graftedTreeType = "pear";
    if (gameData.treeType == "peach") gameData.graftedTreeType = "plum";
    if (gameData.treeType == "lemon") gameData.graftedTreeType = "orange";
  }
}

//==================== Displays Elements Based on Level ========================

// make buttons on main page menu visible based on level
// run every time the level is updated
// it doesn't work when run in sublime, but works in jsfiddle. i think linking the files together is where the issue is
function updateButtons() {
  if (gameData.level >= 2) document.getElementById("btn2").style.display = "block";
  
  if (gameData.level >= 3) document.getElementById("btn3").style.display = "block";
  
  if (gameData.level >= 4) {
    document.getElementById("btn4").style.display = "block";
    document.getElementById("btn5").style.display = "block";
  }

  if (gameData.level >= 7) document.getElementById("btn6").style.display = "block";
  
}
updateButtons();
