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
  localStorage.setItem("saveData", "true");
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
  localStorage.setItem("saveData", "false");
}

// =========== update display functions ===========

// moved here so it can be used in display updates
// moved here so it can be used in display updates
// moved here so it can be used in display updates
const idealPh = {
  "apple": 6.7,
  "peach": 6.5,
  "lemon": 6.2,
};

// make buttons on main page menu visible based on level
// run every time the level is updated
function updateButtons() {
  if (gameData.level >= 2) {
    document.getElementById("btn2").classList.remove("hidden");
    document.getElementById("phDisplay").classList.remove("hidden");
  }

  if (gameData.level >= 3)
    document.getElementById("btn3").classList.remove("hidden");

  if (gameData.level >= 4) {
    document.getElementById("btn4").classList.remove("hidden");
    document.getElementById("btn5").classList.remove("hidden");
  }

  if (gameData.level >= 7)
    document.getElementById("btn6").classList.remove("hidden");
}

//sets tree image based on level and changes the height
function displayTree() {
  document.getElementById("mainTree").src =
    "./images/" +
    gameData.treeType +
    "Tree/" +
    gameData.treeType +
    "Tree" +
    Math.ceil(gameData.level / 3) +
    ".png";

  document.getElementById("treeDiv").style.paddingTop = 16 - gameData.level + "%";
}

//sets and displays overlays for tree
function displayOverlay(
  insects,
  bees,
  fruit,
  fruitYield,
  lowFruitYield,
  highFruitYield,
  grafted
) {
  //sets insect overlay
  if (insects) {
    document.getElementById("bugOverlay").src = "images/insects.png";
    document.getElementById("bugOverlay").classList.remove("hidden");
  }

  //sets bee overlay
  if (bees) {
    document.getElementById("beehives").classList.remove("hidden");
    document.getElementById("bugOverlay").src = "images/bees.png";
    document.getElementById("bugOverlay").classList.remove("hidden");
  }

  //sets fruit overlays
  if (fruit) {
    var rangeOfFruit = highFruitYield - lowFruitYield / 3;
    var amtFruit;
    var source;
    switch (true) {
      case fruitYield <= rangeOfFruit:
        amtFruit = "less";
        break;

      case fruitYield > rangeOfFruit && fruitYield < rangeOfFruit * 2:
        amtFruit = "some";
        break;

      case fruitYield >= rangeOfFruit * 2:
        amtFruit = "more";
    }

    // V reused variable
    var fruit =
      gameData.treeType.substring(0, 1).toUpperCase +
      gameData.treeType.substring(1) +
      "s";

    if (grafted) {
      var secondFruit =
        gameData.graftedTreeType.substring(0, 1).toUpperCase +
        gameData.graftedTreeType.substring(1) +
        "s";
      source =
        amtFruit +
        fruit +
        "And" +
        secondFruit +
        "Tree" +
        Math.ceil(gameData.level / 3);
    } else {
      source = amtFruit + fruit + "Tree" + Math.ciel(gameData.level / 3);
    }

    document.getElementById("fruitOverlay").src = source;
    document.getElementById("fruitOverlay").classList.remove("hidden");
  }
}

//gets rid of overlay
function removeOverlay(fruit, insects, bees) {
  if (fruit) {
    document.getElementById("fruitOverlay").classList.add("hidden");
  }
  if (insects) {
    document.getElementById("bugOverlay").classList.add("hidden");
  }
  if (bees) {
    document.getElementById("beehives").classList.add("hidden");
    document.getElementById("bugOverlay").classList.add("hidden");
  }
}

// sets the menuImg dimensions so they all fit in the buttons
function menuImgDimensions() {
  const menusNode = document.querySelectorAll('.menuImg');
  const menus = Array.from(menusNode);
  menus.forEach(menu => {
    if (menu.width > menu.height) {
      menu.style.width = '60%';
      menu.style.height = 'auto';
    }
  });
}

// updates the info at the top of the screen
function updateInfoBar() {
  const coinCount = document.getElementById('coinDisplayText');
  coinCount.innerHTML = gameData.coins;

  const realPh = document.querySelector('p.real.phText');
  realPh.innerHTML = gameData.pH;
  const idealPhText = document.querySelector('p.ideal.phText');
  idealPhText.innerHTML = ' | ' + idealPh[gameData.treeType];
  const phDifference = determinePhAccuracy();
  const root = document.querySelector(':root');
  root.style.setProperty('--ph-color', 'red');
  if (phDifference < 0.6) root.style.setProperty('--ph-color', 'goldenrod');
  if (phDifference == 0) root.style.setProperty('--ph-color', 'green');
}

function updateDisabled() {
  // if a graft's been purchased, disable graft button
  if (gameData.grafted == true) document.getElementById('btn6').disabled = true;
  
  // if prune is maxed out, disable prune button
  const prune = document.getElementById('btn3');
  if (gameData.pruneNum >= gameData.pruneMax[gameData.level - 1]) {
    prune.disabled = true;
  } else {
    prune.disabled = false;
  }

  // if bees aren't available for any reason, disabled
  const beeBtn = document.getElementById('btn4');
  if (gameData.bees == true || gameData.infested == true || gameData.lastLevelInfested == gameData.level) {
    beeBtn.disabled = true;
  } else {
    beeBtn.disabled = false;
  }

  // if there's not an infestation, disabled
  const repellentBtn = document.getElementById('btn5');
  if (gameData.infested) {
    repellentBtn.disabled = false;
  } else {
    repellentBtn.disabled = true;
  }
}

function updateButtonCost() {
  const beesCostText = document.getElementById('beesCost');
  beesCostText.innerHTML = Math.round(gameData.coinYield / 3 / 5) * 5;
  
  const repellentCostText = document.getElementById('repellentCost');
  repellentCostText.innerHTML = Math.round(gameData.coinYield / 2 / 5) * 5;

  const graftCostText = document.getElementById('graftCost');
  let graftCost = 100;
  if (gameData.treeType == 'peach') graftCost *= 2;
  if (gameData.treeType == 'lemon') graftCost *= 3;
  graftCostText.innerHTML = graftCost;
}

function updateBees() {
  const bees = document.getElementById('beeOverlay');
  const beeHive = document.getElementById('beeHive');
  if (gameData.bees) {
    bees.classList.remove('hidden');
    beeHive.classList.remove('hidden');
  } else {
    bees.classList.add('hidden');
    beeHive.classList.add('hidden');
  }
}

function updateInsects() {
  const insects = document.getElementById('insectOverlay');
  if (gameData.infested) insects.classList.remove('hidden');
  if (!gameData.infested) insects.classList.add('hidden');
}

// called in purchase functions
// declare new update functions before this one
function updateAll() {
  displayTree();
  updateButtons();
  updateInfoBar();
  updateDisabled();
  updateButtonCost();
  updateBees();
  updateInsects();
}

// set next level to happen in the middle of the transition later
function transition() {
  const transitionDiv = document.getElementById('transition');
  console.log(transitionDiv.classList);
  transitionDiv.classList.add('on');
  // transitionDiv.classList.remove('off');
  setTimeout(() => {
    transitionDiv.classList.remove('on');
  }, 1000);
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

function determinePhAccuracy() {
  return Math.abs(
    gameData.pH - idealPh[`${gameData.treeType}`]);
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

  let infestation = 0;
  if (gameData.infested) infestation = -0.5;

  const phDifference = determinePhAccuracy();
  const difFraction = phDifference / 2.7;
  const phAccuracy = -0.1 * difFraction;

  let result =
    gameData.baseFruit[gameData.level - 1] *
    (1 + pollinationRate + gameData.growth + 
    pruneMult + infestation + phAccuracy);

  result = Math.round(result);
  gameData.coinYield = result;
  gameData.coins += result;

//sends information to the displayOverlay function to determine fruit overlay
//didn't have enough time to put it in but also need to calculate the lowest number
//of fruits possible and highest to pass in
// couple of notes: the insects and bees are already being set, and need to be set more often than every level
// many of these values can be called from inside the function, and don't need to be passed
// the src doesn't need to be set from js since they're seperate img elements
  displayOverlay(gameData.insects, gameData.bees, true, result, low, high, gameData.grafted);
}

// to be run every time a level is completed
function nextLevel() {
  determineGrowth();
  gameData.fertilizer = 0;
  gameData.level++;
  determineYield();
  gameData.bees = false;
  gameData.pruneNum = 0;
  updateAll();
  saveData();
}

// =========== button specific functions ===========

// runs when selecting a starting tree in new-game
function startNewGame() {
  clearData();
  saveData();
  location.href = "main-page.html";
  // console.log(gameData);
  // retrieveData();
  // console.log(gameData);
}

// to be run by infoBtn
function toggleInfo() {
  const info = document.getElementById('infoMain');
  info.classList.toggle('hidden');
  const infoBtn = document.getElementById('infoBtn');
  infoBtn.classList.toggle('white');
}

// run in nextLevel function, the first level text will
// be set in the html file
function setInfoText() {
  const infoArray = []; // different text for each level
  const infoText = document.getElementById('infoMainText');
  if (infoArray[gameData.level - 1] !== undefined) {
    infoText.innerHTML = infoArray[gameData.level];
    toggleInfo();
  }
}

// to be run every time a level is completed
function nextLevel() {
  determineGrowth();
  gameData.fertilizer = 0;
  gameData.level++;
  determineYield();
  gameData.bees = false;
  gameData.pruneNum = 0;
  updateAll();
  saveData();
}

// =========== purchase functions ===========

function buyFertilizer() {
  console.clear();
  console.log(gameData);
  if (gameData.coins >= 10) {
    gameData.coins -= 10;
    gameData.fertilizer++;
    // lower the pH
    adjustPH("-");
  }
  updateAll();
  saveData();
}

function buyLimestone() {
  if (gameData.coins >= 10) {
    gameData.coins -= 10;
    // raise the pH
    adjustPH("+");
  }
  updateAll();
  saveData();
}

function buyPrune() {
  if (
    gameData.coins >= 15 &&
    gameData.pruneNum < gameData.pruneMax[gameData.level - 1]
  ) {
    gameData.coins -= 15;
    gameData.pruneNum++;
  }
  updateAll();
  saveData();
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
  updateAll();
  saveData();
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
  updateAll();
  saveData();
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
  updateAll();
  saveData();
}

// =========== event listeners ===========

if (document.URL.includes("new-game.html")) {
  const newAppleTree = document.getElementById("newAppleTree");
  newAppleTree.addEventListener("click", () => {
    gameData.treeType = "apple";
    gameData.coins -= 25;
    startNewGame();
  });

  const newPeachTree = document.getElementById("newPeachTree");
  newPeachTree.addEventListener("click", () => {
    gameData.treeType = "peach";
    gameData.coins -= 45;
    startNewGame();
  });

  const newLemonTree = document.getElementById("newLemonTree");
  newLemonTree.addEventListener("click", () => {
    gameData.coins -= 65;
    gameData.treeType = "lemon";
    startNewGame();
  });
}

if (document.URL.includes("main-page.html")) {
  if (localStorage.getItem("saveData") == "true") retrieveData();
  menuImgDimensions();
  updateAll();
  if (gameData.level == 1) toggleInfo();
}

if (document.URL.includes("index.html")) {
  // grey out resume button if there's no save data
  if (localStorage.getItem('saveData') == 'true') {
    document.getElementById('resume-game').disabled = false;
  } else {
    document.getElementById('resume-game').disabled = true;
  }
}

console.log(gameData);
