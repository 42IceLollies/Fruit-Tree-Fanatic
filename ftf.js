// holds all the main information for the game
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
  levelGrafted: 0,
  graftedTreeType: "unselected",
  pruneNum: 0,
  pruneMax: [0, 0, 3, 5, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8],
  baseFruit: [0, 40, 55, 80, 85, 90, 90, 95, 100, 100, 105, 110, 110, 115, 120],
  progressRecord: [],
  coinYield: 0,
  harvested: true,
};

 
// =============== save data functions ===============
 
// saves the gameData object values to localStorage
function saveData() {
  for (const key in gameData) {
    
    if (key !== "progressRecord"){
       localStorage.setItem(`${key}`, gameData[key]);
    } else {
      localStorage.setItem("progressRecord", JSON.stringify(gameData.progressRecord))
    }
  }
  // marks that there is saved data to retrieve
  localStorage.setItem("saveData", "true");
}
 
// pulls the info from localStorage when loading a saved game, and converts to original types
function retrieveData() {
  // converts the following to numbers
  const toNum = [
    "coins",
    "fertilizer",
    "growth",
    "level",
    "pH",
    "pruneNum",
    "coinYield",
    "lastLevelInfested",
    "levelGrafted",
  ];
  // converts the following to arrays
  const toArray = ["baseFruit", "pruneMax"]; //  const toArray = ["baseFruit", "pruneMax", "progressRecord"];
  // converts the following to boolean
  const toBoolean = ["bees", "grafted", "infested", "harvested"];
  for (const key in gameData) {
    gameData[`${key}`] = localStorage.getItem(`${key}`);
  //  gameData[`${key}`] = localStorage.getItem(`${key}`); - I could be reading this wrong but do there need to be two lines of these?
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

  // array of objects, reverted individually
  gameData.progressRecord = JSON.parse(gameData.progressRecord);
  // didn't want array elements to be converted to numbers with the rest of the arrays - ig it could just go in the boolean one tho?
  // being seperate makes sense
}
 
// clears the saved data from localStorage
function clearData() {
  for (const key in gameData) {
    localStorage.removeItem(`${key}`);
  }
  // marks that there's no longer any saved data to retrieve
  localStorage.setItem("saveData", "false");
}
 
// =========== update display functions ===========

// the ideal pH for each kind of tree, easily accessible
// not kept in gameData because it doesn't change, so it doesn't need to saved to localStorage
const idealPh = {
  "apple": 6.7,
  "peach": 6.5,
  "lemon": 6.2,
};
 
// make buttons on main page menu visible based on level
// run every time the level is updated
function updateButtons() {
  if (gameData.level >= 2) {
    // show limestone button, and pH indicator in info-bar
    document.getElementById("btn2").classList.remove("hidden");
    document.getElementById("phDisplay").classList.remove("hidden");
  }
 
  // show prune button
  if (gameData.level >= 3)
    document.getElementById("btn3").classList.remove("hidden");
 
  // show bees and insect repellent buttons
  if (gameData.level >= 4) {
    document.getElementById("btn4").classList.remove("hidden");
    document.getElementById("btn5").classList.remove("hidden");
  }
 
  // show graft button
  if (gameData.level >= 7)
    document.getElementById("btn6").classList.remove("hidden");
}
 
// sets tree image and padding-top height based on level
function displayTree() {
  // compiles the tree image src based on gameData values
  document.getElementById("mainTree").src =
    "./images/" +
    gameData.treeType +
    "Tree/" +
    gameData.treeType +
    "Tree" +
    Math.ceil(gameData.level / 2) +
    ".png";
  
  // sets the css variable used in the padding-top of multiple elements to make the tree image increase in height
  const root = document.querySelector(":root");
  root.style.setProperty('--padding-top', 21 - gameData.level + "%");
}

// finds the potential max and min fruit possible by level
function findYieldRange() {
  // finds the fruit yield off of the coin yield
  var fruitYield = gameData.coinYield;
  if (gameData.treeType == 'peach') fruitYield /= 2;
  if (gameData.treeType == 'lemon') fruitYield /= 3;
 
  var lowFruitYield = gameData.baseFruit[gameData.level-1] * 0.35;
  var highFruitYield = (gameData.baseFruit[gameData.level-1] * 1.835) + 20;
 
  return {highFruitYield, lowFruitYield, fruitYield};
}

// sets the src of the fruit overlay based on gameData values
function setOverlay() {
  var yield = findYieldRange();
  var fruitYield = yield.fruitYield;
  var lowFruitYield = yield.lowFruitYield;
  var highFruitYield = yield.highFruitYield;

  var rangeOfFruit = (highFruitYield - lowFruitYield) / 12;
  // if you want it to be more noticable of a difference, we can divide this by 6
  // why's it divided by 12?

  // sets the amount of fruit shown in the overlay based on how much of the potential was generated
  var amtFruit;
  var source;
  switch (true) {
    case fruitYield <= lowFruitYield + rangeOfFruit * 5: //*0
      amtFruit = "less";
      break;
 
    case fruitYield > lowFruitYield + rangeOfFruit && fruitYield < lowFruitYield + rangeOfFruit * 9: //*2
      amtFruit = "some";
      break;
 
    case fruitYield >= lowFruitYield + rangeOfFruit * 9: //*2
      amtFruit = "more";
  }
   
  var fruitType =
    gameData.treeType.substring(0, 1).toUpperCase() +
    gameData.treeType.substring(1) + "s";
    if (gameData.treeType == 'peach') fruitType = 'Peaches';
    // it returns peachs otherwise

    var lcFruitType = gameData.treeType + 's';
    if (lcFruitType == 'peachs') lcFruitType = gameData.treeType + 'es';
 // I think i'm going insane rn cos I can't stop laughing about peachs with no e
 // (pls feel free to delete this comment lmao)
 // nah, this is staying in the final version

    var srcStart = `./images/${gameData.treeType}Tree/${lcFruitType}/`;

    if (gameData.grafted) { 
      var secondFruit =
        gameData.graftedTreeType.substring(0, 1).toUpperCase() +
        gameData.graftedTreeType.substring(1) +
        "s";
      srcStart = `./images/${gameData.treeType}Tree/${lcFruitType}And${secondFruit}/`;
      source = `${srcStart}${amtFruit}${fruitType}And${secondFruit}Tree${Math.ceil(gameData.level / 3)}.png`;
    } else {
      source = `${srcStart}${amtFruit}${fruitType}Tree${Math.ceil(gameData.level / 2)}.png`;
    }
    document.getElementById("fruitOverlay").src = source;
}
 
// sets and displays overlays for tree
function displayOverlay() {
  setOverlay();
  document.getElementById("fruitOverlayDiv").classList.remove("hidden");
}
 
// gets rid of overlay
function removeOverlay() {
    document.getElementById("fruitOverlayDiv").classList.add("hidden");
}
 
// sets the menuImg dimensions so they all fit in the buttons
// run when main-page loads
function menuImgDimensions() {
  // if the image is wider than it is tall, set the width instead of the height
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
  // sets the coin counter to the gameData value
  const coinCount = document.getElementById('coinDisplayText');
  coinCount.innerHTML = gameData.coins;
 
  // sets the pH indicator based on idealPH object and the gameData value
  const realPh = document.querySelector('p.real.phText');
  realPh.innerHTML = gameData.pH;
  const idealPhText = document.querySelector('p.ideal.phText');
  idealPhText.innerHTML = ' | ' + idealPh[gameData.treeType];
  const phDifference = determinePhAccuracy();
  const root = document.querySelector(':root');
  root.style.setProperty('--ph-color', 'red');
  if (phDifference < 0.6) root.style.setProperty('--ph-color', 'goldenrod');
  if (phDifference == 0) root.style.setProperty('--ph-color', 'green');

  // sets the graft symbol based on if player has purchased the graft
  const graftDiv = document.getElementById('graftedDiv');
  if (gameData.grafted) graftDiv.classList.remove('hidden');
  if (!gameData.grafted) graftDiv.classList.add('hidden');

  // sets the text showing the level based on the gameData value
  const levelText = document.getElementById('levelText');
  levelText.innerHTML = gameData.level;
}
 
// updates which buttons are disabled, based on the availability
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
  // if you've already purchased bees, if there's an infestation, or if there was an infestation this level
  if (gameData.bees == true || gameData.infested == true || gameData.lastLevelInfested == gameData.level) {
    beeBtn.disabled = true;
  } else {
    beeBtn.disabled = false;
  }
 
  // if there's not an infestation, you can't buy repellent
  const repellentBtn = document.getElementById('btn5');
  if (gameData.infested) {
    repellentBtn.disabled = false;
  } else {
    repellentBtn.disabled = true;
  }
}

// sets the color meter that how well you're doing based on yield out of potential yield
function updateAcheivementDivision() {
  var ids = ["firstDivision", "secondDivision", "thirdDivision", "fourthDivision", "fifthDivision"];
  for (var i = 0; i<ids.length; i++) {
   document.getElementById(ids[i]).classList.add("divisionDisabled");
  }

  var yield = findYieldRange();
  var min = yield.lowFruitYield;
  var range = yield.highFruitYield - yield.lowFruitYield;
  yield = yield.fruitYield;
  // console.log(range);
  // console.log(yield);


  // can't divide by 0, gotta keep it seperate
  if (yield > min) {
    document.getElementById(ids[0]).classList.remove("divisionDisabled");
  } else {
    document.getElementById(ids[0]).classList.add("divisionDisabled");
  }

  // for each benchmark, color it in if player's reached it
  for (var i = 1; i < ids.length; i++) {
    if (yield > min + ((range / 5) * i)) {
      document.getElementById(ids[i]).classList.remove("divisionDisabled");
    } else {
      document.getElementById(ids[i]).classList.add("divisionDisabled");
    }
  }
}

// updates the shown costs of bees, repellent and grafting
// (the only ones that change) /\
function updateButtonCost() {
  // all cost determination copied from purchase function
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

// update if bee overlays are showing based on gameData.bees
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

// updates if insectOverlay is showing, based on gameData.infestation
function updateInsects() {
  const insects = document.getElementById('insectOverlay');
  if (gameData.infested) insects.classList.remove('hidden');
  if (!gameData.infested) insects.classList.add('hidden');
}

// updates the fine details of where the fruit overlay is
// so that it'll stay over the leaves of the tree
function updateOverlayDimensions() {
  const fo = document.getElementById('fruitOverlay');
  const foDiv = document.getElementById('fruitOverlayDiv');
  // numbers determined by trial and error
  switch(gameData.treeType) {
    case ('apple'):
      fo.style.height = '45%';
      foDiv.style.height = '72%';
      foDiv.style.top = '8%';
      if (gameData.level >= 10) {
        fo.style.height = '50%';
        foDiv.style.height = '68%';
        foDiv.style.top = '12%';
      }
      break
    case ('peach'):
      fo.style.height = '50%';
      foDiv.style.height = '70%';
      foDiv.style.top = '10%';
      if (gameData.level >= 9) {
        foDiv.style.height = '65%';
        foDiv.style.top = '15%';
      }
      if (gameData.level >= 13) {
        fo.style.height = '60%';
      }
      break
    case ('lemon'):
      fo.style.height = '40%';
      foDiv.style.height = '74%';
      foDiv.style.top = '6%';
      break
  }
}

// hides the achievement marker in the first level, since there's no yield
function updateAchievementHidden() {
  const achievementDiv = document.querySelector('.achievementDiv');
  if (gameData.level > 1) {
    achievementDiv.classList.remove('hidden');
  } else {
    achievementDiv.classList.add('hidden');
  }
}

// changes the text in the purchase buttons to red if player has too few coins
function updatePriceColor() {
  const buttonCosts = document.querySelectorAll('.price .coinText');
  
  buttonCosts.forEach(cost => {
    // if number of coins is less than this cost
    if (gameData.coins < Number(cost.innerHTML)) {
      cost.classList.add('red');
    } else {
      cost.classList.remove('red');
    }
  });
}
 
// called in purchase functions
// calls all preceding update functions, makes it easier to add another to many places in the code at once
function updateAll() {
  displayTree();
  updateButtons();
  updateInfoBar();
  updateDisabled();
  updateButtonCost();
  updateAcheivementDivision();
  updateBees();
  updateInsects();
  updateAchievementHidden();
  updatePriceColor();
  setInfoText(false);
}
 
// called when nextLevelBtn is clicked
// fades screen to black, then calls nextLevel
function transition() {
  // disables the button so you can't double click and skip a level
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  nextLevelBtn.disabled = true;

  // if it's over, move to the credits page
  if (gameData.level == 10) {
    gameData.progressRecord[gameData.level-1] = findYieldRange();
    saveData();
   location.href = 'end-page.html';
   return;
  }

  // fade to black
  const transitionDiv = document.getElementById('transition');
  transitionDiv.classList.add('on');
  setTimeout(() => {
    // when it's fully faded, run nextLevel()
    nextLevel();
    // fade back
    transitionDiv.classList.remove('on');
    // enable the button again
    nextLevelBtn.disabled = false;
  }, 1000); // same amount of time as the fade takes
}

// opens/closes the menu 
function toggleMainMenu() {
  // slides in the side menu
  document.getElementById('mainMenu').classList.toggle('show');
  // greys out the rest of the screen
  document.getElementById('transition').classList.toggle('faded');
}

// makes the purchase buttons blink when clicked
function menuBtnClicked() {
  const buttons = document.querySelectorAll('.menuBtn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // lowers the opacity
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 75); // applied for this number of milliseconds
    });
  });
}

// call each time gameData.coins is changed, with the amount change, and if increasing or decreasing
function coinChange(increase, num) {
  const coinChangeText = document.getElementById('coinChangeText');
  const coinChangeDiv = document.getElementById('coinChangeDiv');
  
  let sign;
  if (increase) sign = '+';
  if (!increase) sign = '-';
  coinChangeText.innerHTML = sign + num;
  // only removing green since it's on top, so it doesn't matter if red is under
  coinChangeText.classList.remove('green');
  // sets text color based on if it's increasing or not
  if (increase) coinChangeText.classList.add('green');
  if (!increase) coinChangeText.classList.add('red');
  // reset so it can fade
  coinChangeDiv.style.opacity = '1';
  coinChangeDiv.classList.remove('hidden');

  // fade over 1.5 seconds
  const ccIntId = setInterval(() => {
    if (coinChangeDiv.style.opacity <= 0) {
      coinChangeDiv.classList.add('hidden');
      clearInterval(ccIntId);
    }
    coinChangeDiv.style.opacity -= 0.1;
  }, 150);
}
 
// =========== mathematical functions ===========
 
// changes the pH level
// run when buying fertilizer/limestone, input '+' or '-';
function adjustPH(change) {
  // when it's within the middle range, change by 0.1
  if (gameData.pH > 6 && gameData.pH < 8) {
    if (change == "+") gameData.pH += 0.1;
    if (change == "-") gameData.pH -= 0.1;
    // round to 1 place after the decimal
    gameData.pH = Math.round(gameData.pH * 10) / 10;
  } else {
    // when it's far from the goal, change by 0.01
    if (change == "+") gameData.pH += 0.01;
    if (change == "-") gameData.pH -= 0.01;
    // round to 2 places after the decimal
    gameData.pH = Math.round(gameData.pH * 100) / 100;
  }
  saveData();
}
 
// randomly decides if you get an insect infestation, better trees more likely
// to be called every time player advances a level
function determineInfestation() {
  // if it's before level 4, or already infested, don't run the function. precaution
  if (gameData.level < 4) return;
  if (gameData.infested == true) return;
  let chance;
  // 10% for apple trees
  if (gameData.treeType == "apple") chance = 10;
  // 25% for peach trees
  if (gameData.treeType == "peach") chance = 25;
  // 40% for lemon trees
  if (gameData.treeType == "lemon") chance = 40;
  // if the tree was infested last round, halve the chance
  if (gameData.lastLevelInfested == gameData.level - 1) chance /= 2;
  // if a random number up to 100 is within the chance range, it becomes infested
  const percent = Math.random() * 100;
  if (percent <= chance) {
    gameData.infested = true;
    gameData.lastLevelInfested = gameData.level;
  }
}
 
// determines how much the tree grows based on the amount of fertilizer purchased and the level
// to be run before level and fertilizer are updated
function determineGrowth() {
  let fertilizer = gameData.fertilizer;
  // if player bought more than 10 fertilizer, it starts to have a negative effect
  if (fertilizer > 10) fertilizer = 10 - (fertilizer - 10);
  // adds to growth, increasing fruit yield
  // essentially percents in decimal form
  // for 1st level, 0.01
  if (gameData.level == 1)
    gameData.growth += fertilizer * 0.01;
  // for 3rd and 4th, 0.005
  if (gameData.level == 2 || gameData.level == 3)
    gameData.growth += fertilizer * 0.005;
  // from then on, 0.0005
  if (gameData.level >= 4) gameData.growth += fertilizer * 0.0005;
}

// returns how far off the pH is from what it should be
function determinePhAccuracy() {
  return Math.abs(
    gameData.pH - idealPh[`${gameData.treeType}`]);
}

// returns how much grafted fruit is produced
// based on levels since purchase, and type of fruit
function determineGraftedFruit() {
  if (!gameData.grafted) return;
  let amount = 10;
  // if it's been a level, 15 fruit
  if (gameData.levelGrafted <= gameData.level - 2) amount = 15;
  // if it's been 2 levels, 20 fruit
  if (gameData.levelGrafted <= gameData.level - 3) amount = 20;

  // plums and pears are worth more than oranges
  if (gameData.graftedTreeType == "plum") amount *= 2;
  if (gameData.graftedTreeType == "pear") amount *= 3;

  return amount;
}
 
// determines the fruit yield at the beginning of each level
// to be run after level has been updated and growth from fertilizer has been determined, but no other data has been changed
function determineYield() {
  // without bees, the pollinationRate could reduce yield by up to 5%
  let pollinationRate = Math.round((0 - Math.random() / 20) * 100) / 100;
  // with bees, increased by 50%
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
 
  // insect infestation removes 50%
  let infestation = 0;
  if (gameData.infested) infestation = -0.5;
 
  // pH inaccuracy can remove up to 10%
  const phDifference = determinePhAccuracy();
  const difFraction = phDifference / 2.7;
  // 2.7 because I decided that's the reasonable pH range
  const phAccuracy = -0.1 * difFraction;
 
  // added before multiplication so all factors have an equal influence
  let result =
    gameData.baseFruit[gameData.level - 1] *
    (1 + pollinationRate + gameData.growth + 
    pruneMult + infestation + phAccuracy);
  result = Math.round(result);

  // peaches and lemons are worth more than apples
  if (gameData.treeType == 'peach') result *= 2;
  if (gameData.treeType == 'lemon') result *= 3;

  // if a graft has been purchased, add grafted fruit
  if (gameData.grafted) {
    const graftedFruit = determineGraftedFruit();
    result += graftedFruit;
  }

  gameData.coinYield = result;
  // result added to gameData.coins when overlay is clicked and fruit is collected
}
  
// =========== button specific functions ===========
 
// runs when selecting a starting tree in new-game
function startNewGame() {
  clearData();
  saveData();
  location.href = "main-page.html";
}
 
// to be run by infoBtn
// hides/shows the info box in the top left
function toggleInfo() {
  const info = document.getElementById('infoMain');
  info.classList.toggle('hidden');
  const infoBtn = document.getElementById('infoBtn');
  infoBtn.classList.toggle('white');
}

// shows the info box in the top left
function showInfo() {
  const info = document.getElementById('infoMain');
  info.classList.remove('hidden');
  const infoBtn = document.getElementById('infoBtn');
  infoBtn.classList.add('white');
}

// hides the info box in the top left
function hideInfo() {
  const info = document.getElementById('infoMain');
  info.classList.add('hidden');
  const infoBtn = document.getElementById('infoBtn');
  infoBtn.classList.remove('white');
}

// run in nextLevel function
// if it's a new level, show infoMain
function setInfoText(newLevel) {
  // array of text for the new items
  const infoArray = ["Welcome to the game! Here is your tree, try buying some fertilizer to feed it so it will grow lots of fruit next level!", "You have your first harvest! Click the fruit to collect it. It turns out the fertilizer lowers the pH of the soil. You can buy limestone to balance it out, but don't forget to keep your soil fertile.", "Now you can prune your tree, to focus it on producing fruit instead of new growth.", "Bees can help pollinate your tree. They're only available once per level, and not available if you've recently had insects.", undefined, undefined, "You've unlocked the option to graft your tree. Grafting another type of fruit onto your tree can increase output, but it's quite an investment."];

  const infoText = document.getElementById('infoMainText');

  // basic instructions, always included at the bottom
  const baseText = "- Click fruit to collect it. <br>- Buy items and actions to keep your tree healthy. <br>- Click the 'Next Level' button when you are done.";

  // if there's instructions for this level
  if (infoArray[gameData.level - 1] !== undefined) {
    infoText.innerHTML = infoArray[gameData.level - 1] + "<br><br>" + baseText;
    // if it's the start of a new level, show infoMain
    if (newLevel) showInfo();
  } else {
    // if there's no special instructions, just put the basic instructions
    infoText.innerHTML = baseText;
  }

  // if there's insects, add instructions of what to do to the front
  if (gameData.infested) {
    infoText.innerHTML =  "Uh oh! Your tree has become infested with insects. You can buy repellent to get rid of them. They should be dealt with as soon as possible to ensure your future harvests are good. <br> <br>" + infoText.innerHTML;
    if (newLevel) showInfo();
  }
}

 
// to be run every time a level is completed
// determines random events, resets all necessary data, and determines yield
function nextLevel() {
  determineGrowth();
  gameData.progressRecord[gameData.level-1] = findYieldRange();
  gameData.fertilizer = 0;
  gameData.level++;
  determineYield();
  gameData.bees = false;
  gameData.pruneNum = 0;
  updateOverlayDimensions();
  setInfoText(true);
  gameData.harvested = false;
  displayOverlay();
  determineInfestation();
  updateAll();
  // if player hasn't gotten rid of insects, log that it's still infested
  if (gameData.infested) gameData.lastLevelInfested = gameData.level;
  saveData();
}
 
// =========== purchase functions ===========
 
// run by menuBtn#fertilizer
function buyFertilizer() {
  console.clear();
  console.log(gameData);
  if (gameData.coins >= 10) {
    gameData.coins -= 10;
    gameData.fertilizer++;
    // lower the pH
    adjustPH("-");
    coinChange(false, 10);
  }
  updateAll();
  saveData();
}

// run by menuBtn#limestone
function buyLimestone() {
  if (gameData.coins >= 10) {
    gameData.coins -= 10;
    // raise the pH
    adjustPH("+");
    coinChange(false, 10);
  }
  updateAll();
  saveData();
}

// run by menuBtn#prune
function buyPrune() {
  if (
    gameData.coins >= 15 &&
    gameData.pruneNum < gameData.pruneMax[gameData.level - 1]
  ) {
    gameData.coins -= 15;
    gameData.pruneNum++;
    coinChange(false, 15);
  }
  updateAll();
  saveData();
}

// run by menuBtn#bees
function buyBees() {
  // can't buy bees if there's an infestation, or if it was infested this level
  if (gameData.infested || gameData.lastLevelInfested == gameData.level) return;
  // a third of the coin yield, rounded to the nearest 5
  const beePrice = Math.round(gameData.coinYield / 3 / 5) * 5;
  if (gameData.coins >= beePrice) {
    gameData.coins -= beePrice;
    gameData.bees = true;
    coinChange(false, beePrice);
  }
  updateAll();
  saveData();
}

// run by menuBtn#repellent
function buyRepellent() {
  // can't buy it if there's no infestation
  if (!gameData.infested) return;
  const repellentPrice = Math.round(gameData.coinYield / 2 / 5) * 5;
  if (gameData.coins >= repellentPrice) {
    gameData.coins -= repellentPrice;
    gameData.infested = false;
    coinChange(false, repellentPrice);
  }
  updateAll();
  saveData();
}

// run by menuBtn#graft
function buyGraft() {
  // can't buy until level 7
  if (gameData.level < 7 || gameData.grafted) return;
  // the price is the coins value from 100 fruit
  let graftPrice = 100;
  if (gameData.treeType == "peach") graftPrice *= 2;
  if (gameData.treeType == "lemon") graftPrice *= 3;
 
  if (gameData.coins >= graftPrice) {
    gameData.coins -= graftPrice;
    coinChange(false, graftPrice);
    gameData.grafted = true;
    gameData.levelGrafted = gameData.level;
    // determine the grafted type based on the tree type
    if (gameData.treeType == "apple") gameData.graftedTreeType = "pear";
    if (gameData.treeType == "peach") gameData.graftedTreeType = "plum";
    if (gameData.treeType == "lemon") gameData.graftedTreeType = "orange";
  }
  updateAll();
  saveData();
}
 
// =========== on page-load ===========

// if on new-game page
if (document.URL.includes("new-game.html")) {
  // event listeners for if the divs are clicked to pick a starter tree
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

// if on the main-page
if (document.URL.includes("main-page.html")) {
  // retrieve saved data
  if (localStorage.getItem("saveData") == "true") retrieveData();
  // set all variable images
  menuImgDimensions();
  updateOverlayDimensions();
  updateAll();
  setOverlay();
  // menuBtnClicked();
  // not sure why this /\ was here

  // if the fruit hasn't been collected, show it
  // this way you don't lose the fruit if the page reloads
  if (!gameData.harvested) displayOverlay();
  // not triggered in nextLevel function, because there's no level before it
  // called here instead
  if (gameData.level == 1) setInfoText(true);

  saveData();

  // event listener for when the fruit is clicked to be collected
  document.getElementById("fruitOverlay").addEventListener("click", () => {
      removeOverlay();
      // adds coins after fruit has been collected
      gameData.coins += gameData.coinYield;
      coinChange(true, gameData.coinYield);
      gameData.harvested = true;
      updateInfoBar();
      updatePriceColor();
      saveData();
  });
}

// if on index page
if (document.URL.includes("index.html")) {
  // grey out resume button if there's no save data
  if (localStorage.getItem('saveData') == 'true') {
    document.getElementById('resume-game').disabled = false;
  } else {
    document.getElementById('resume-game').disabled = true;
  }
}

// makes all images non-draggable, so people will stop thinking it's drag-and-drop!
const images = document.querySelectorAll('img');
images.forEach(image => {
  image.draggable = false;
});

console.log(gameData);
console.log(findYieldRange());


//plays music when page is loaded
window.onload = document.getElementById("generalTheme").play();

//to do list as far as music - need to make it repeat when it reaches the end of the song, maybe make it so it doesn't start over
//again when you go to a new page, add bee and bug themes
