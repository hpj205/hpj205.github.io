let deer, badger, bunny, teepee;
let stick, bark, berries, honey, leaf, mushrooms;
let startImg;
let click;
let ding;
let showStartImg = true;
let currentAnimal = null;
let isMusicPlaying = false;
let menu = ["something sweet", "something earthy", "something leafy"];
//this also proved difficult
let foodItems = [
  {
    name: "sticks",
    x: 100,
    y: 450,
    w: 50,
    h: 50,
    isDragging: false,
    initialX: 100,
    initialY: 450,
  },
  {
    name: "leaves",
    x: 250,
    y: 450,
    w: 50,
    h: 50,
    isDragging: false,
    initialX: 130,
    initialY: 450,
  },
  {
    name: "berries",
    x: 300,
    y: 450,
    w: 50,
    h: 50,
    isDragging: false,
    initialX: 160,
    initialY: 450,
  },
  {
    name: "mushrooms",
    x: 350,
    y: 450,
    w: 50,
    h: 50,
    isDragging: false,
    initialX: 190,
    initialY: 450,
  },
  {
    name: "bark",
    x: 400,
    y: 450,
    w: 50,
    h: 50,
    isDragging: false,
    initialX: 210,
    initialY: 450,
  },
  {
    name: "honey",
    x: 450,
    y: 450,
    w: 50,
    h: 50,
    isDragging: false,
    initialX: 240,
    initialY: 450,
  },
];

let animals = [
  { name: "deer", image: null },
  { name: "badger", image: null },
  { name: "bunny", image: null },
  { name: "teepee", image: null },
];

let timer = 60;
let points = 0;
let music;
let draggedFood = null;

function setup() {
  createCanvas(800, 600);

  serveButton = createButton("serve dish");
  serveButton.position(width / 2 + 70, height - 30);
  serveButton.mousePressed(serveDish);

  resetGame();
}

function preload() {
  deer = loadImage("img/Illustration23 (2).png");
  badger = loadImage("img/badger-sprite.png");
  bunny = loadImage("img/bunny-sprite.png");
  teepee = loadImage("img/teepee-sprite.png");

  stick = loadImage("img/stick.png");
  bark = loadImage("img/bark.png");
  berries = loadImage("img/berries.png");
  honey = loadImage("img/honey.png");
  leaf = loadImage("img/leaf.png");
  mushrooms = loadImage("img/mushrooms.png");
  startScreen = loadImage("img/start-buttong.png");
  // this start button, and getting it to work as a button took me too much time

  animals[0].image = deer;
  animals[1].image = badger;
  animals[2].image = bunny;
  animals[3].image = teepee;

  music = loadSound("libraries/game-bg-music.mp3", () => {
    music.loop();
  });
  click = loadSound("libraries/mouse_click_sound_effect.mp3");
  ding = loadSound("libraries/glow_sound_effect.mp3");
  startImg = loadImage("img/start-buttong.png");
}

// this was an easy fix to an issue that look me ages to figure out (browser not autoplaying music)
function startAudio() {
  if (!isMusicPlaying) {
    music.play(); // play music
    isMusicPlaying = true;
    startImg.hide();
  }
}
function resetGame() {
  currentAnimal = random(animals);
  currentAnimal.order = random(menu);
  resetFoodPositions();
}

function draw() {
  if (showStartImg) {
    drawStartImg(); // draw the start screen
  } else {
    background(200, 250, 255);
    drawCloud();
    drawCampus();
    drawBackground();
    drawTimer();

    if (currentAnimal) {
      drawAnimal();
      drawOrderBubble(currentAnimal.order);
    }

    drawTable();
    drawMenu();
    drawFoodItems();
    drawPoints();
  }
}
function drawStartImg() {
  image(startImg, 50, 30, 700, 650); // button
}

//MOUSE FUNCTIONALITY
function mousePressed() {
  //START IMAGE
  if (showStartImg) {
    if (
      mouseX > width / 2 - 150 &&
      mouseX < width / 2 + 150 &&
      mouseY > height / 2 - 75 &&
      mouseY < height / 2 + 75
    ) {
      startAudio();
      showStartImg = false;
    }
  } else {
    //DRAG AND DROPPING FOOD ITEMS
    for (let item of foodItems) {
      if (
        mouseX > item.x &&
        mouseX < item.x + item.w &&
        mouseY > item.y &&
        mouseY < item.y + item.h
      ) {
        item.isDragging = true;
        click.play();
        break;
      }
    }
  }
}

// checking if the order is correct
function checkOrder() {
  let currentOrder = currentAnimal.order;
  if (
    currentOrder === "sticks and leaves" &&
    foodItemsNearAnimal(["sticks", "leaves"])
  ) {
    return true;
  } else if (
    currentOrder === "berries and honey" &&
    foodItemsNearAnimal(["berries", "honey"])
  ) {
    return true;
  } else if (
    currentOrder === "mushrooms and bark" &&
    foodItemsNearAnimal(["mushrooms", "bark"])
  ) {
    return true;
  }
  return false;
}

//points system
function serveDish() {
  if (checkOrder()) {
    points--; //add a point and decrease a point
  } else {
    points++;
    ding.play();
  }
  resetGame();
}
//PROXIMITY CHECK

function foodItemsNearAnimal(requiredItems) {
  for (let required of requiredItems) {
    let found = false;
    for (let item of foodItems) {
      if (item.name === required) {
        let distanceToAnimal = dist(item.x, item.y, width / 2, height / 2);
        if (distanceToAnimal < 50) {
          //ensuring food is dragged and dropped to the customer
          found = true;
          break;
        }
      }
    }
    if (!found) return false;
  }
  return true;
}
//CLOUD
function drawCloud() {
  fill(255);
  circle(600, 100, 100);
  circle(670, 90, 150);
  circle(750, 100, 100);
}
//CAMPUS
//this part was challenging until i realized i could use a for-loop to draw the windows
function drawCampus() {
  fill(247, 149, 79); // brick red
  rect(150, 300, 500, 200); // main building

  rect(170, 180, 50, 120); // left tower
  rect(580, 180, 50, 120); // right tower
  fill(105, 105, 105); // roof color
  triangle(170, 180, 195, 120, 220, 180); // left roof
  triangle(580, 180, 605, 120, 630, 180); // right roof

  fill(240); // white for windows
  let xStart = 160; // initial x
  let yStart = 310; // initial y
  let windowSize = 30;
  let spacing = 10;
  for (let x = xStart; x < 640; x += windowSize + spacing) {
    for (let y = yStart; y < 480; y += windowSize + spacing) {
      rect(x, y, windowSize, windowSize);
    }
  }
}
//BACKGROUND
function drawBackground() {
  fill(161, 125, 88);
  rect(20, 100, 60, width, 50);
  fill(144, 224, 144); // i wanted use noise to make the grass more grass-like, but cldnt make it work so i left it out
  noStroke();
  rect(0, height - 150, width, 150);
  fill(96, 150, 102);
  circle(50, 100, 500, 50);
}

function drawAnimal() {
  if (currentAnimal && currentAnimal.image) {
    image(currentAnimal.image, width / 2 - 40, height / 2 - 50, 250, 250);
  }
}
//TABLE
function drawTable() {
  //BIG
  fill(161, 125, 88);
  rect(width / 2 - 100, height - 160, 400, 300, 20, 20);
  fill(199, 160, 111);
  ellipse(width / 2 + 100, height - 150, 400, 70);
  rect(width / 2 + 30, height - 50, 150, 50, 20, 20, 20, 20);
  //SMALL
  fill(161, 125, 88);
  rect(width / 2 - 300, height - 120, 190, 300, 20, 20);
  fill(199, 160, 111);
  ellipse(width / 2 - 205, height - 110, 190, 70);
}
//ORDER BUBBLE
function drawOrderBubble(order) {
  fill(255);
  rect(width / 2 + 100, height - 270, 200, 60, 40, 20, 20, 5);
  fill(8, 92, 11);
  textSize(20);
  textAlign(CENTER);
  text(order, width / 2 + 200, height - 235);
}
//MENU
function drawMenu() {
  fill(199, 160, 111);
  rect(10, 5, 200, 100, 20);
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text("Menu:", 20, 20);
  for (let i = 0; i < menu.length; i++) {
    text(i + 1 + ". " + menu[i], 20, 40 + i * 20);
  }
}

// GAME MECHANICS
function drawFoodItems() {
  const imageMap = {
    sticks: stick,
    bark: bark,
    berries: berries,
    honey: honey,
    leaves: leaf,
    mushrooms: mushrooms,
  };

  for (let item of foodItems) {
    image(imageMap[item.name], item.x, item.y, item.w, item.h);
  }
}

function resetFoodPositions() {
  // returning food after drag and dropping
  for (let item of foodItems) {
    item.x = item.initialX;
    item.y = item.initialY;
  }
}

//TIMER
function drawTimer() {
  textSize(18);
  fill(72, 107, 84);
  textAlign(CENTER);
  text(`time left: ${timer}`, width - 100, 30);

  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }

  if (timer === 0) {
    noLoop();
    fill(255);
    rect(160,270,500,50,50);
    fill(72, 107, 84);
    textSize(32);
    textAlign(CENTER);
    text("game over! customers served: " + points, width / 2, height / 2);
    serveButton.hide(); // hide the button
  }
}

function mouseDragged() {
  for (let item of foodItems) {
    if (item.isDragging) {
      item.x = mouseX - item.w / 2;
      item.y = mouseY - item.h / 2;
      break;
    }
  }
}

function mouseReleased() {
  for (let item of foodItems) {
    item.isDragging = false;
  }
}

//POINTS
function drawPoints() {
  fill(72, 107, 84);
  text("customers served: " + points, width / 2, 30);
 
}
