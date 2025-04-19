let server = "https://tdb01.ruc.dk/tdb-api/?q=";
let data = [];
let posterImages = [];
let noPosterImg;
let years = [];

let offsetX = 0;
let dragging = false;
let lastMouseX = 0;

let arrowX = null;
let targetIndex = null;
let animating = false;
let animationSpeed = 10;
let targetX = null;

let randomButton;

function preload() {
  noPosterImg = loadImage("Nosign.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(12);

  loadJSON(server + 
    "select rating, year, poster FROM movie where (year, rating) IN " +
    "(select year, MAX(rating) from movie where year BETWEEN 2000 and 2024 GROUP BY year) " +
    "ORDER BY year ASC", 
    gotData);

  // Random-knap
  randomButton = createButton("Random");
  randomButton.position(20, 20);
  randomButton.mousePressed(startRandomSelection);
}

function gotData(result) {
  data = result;

  for (let i = 0; i < data.length; i++) {
    let posterURL = data[i].poster;

    if (posterURL) {
      loadImage(posterURL, img => {
        posterImages[i] = img;
      }, () => {
        posterImages[i] = noPosterImg;
      });
    } else {
      posterImages[i] = noPosterImg;
    }

    years[i] = data[i].year;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  stroke(0);
  line(0, height / 2, width, height / 2);

  if (posterImages.length !== data.length) {
    fill(0);
    text("Indlæser plakater...", width / 2, height / 2);
    return;
  }

  let spacing = 80;

  for (let i = 0; i < data.length; i++) {
    let x = 100 + i * spacing + offsetX;
    let y = height / 2;

    let img = posterImages[i];
    image(img, x - 25, y - 95, 50, 75);

    noStroke();
    fill(0);
    text(data[i].year, x, y + 80);
    text("★ " + nf(data[i].rating, 1, 1), x, y + 100);

    stroke(0);
    fill(255);
    ellipse(x, y, 10);
  }

  if (animating && arrowX !== null && targetX !== null) {
    let direction = targetX > arrowX ? 1 : -1;
    arrowX += animationSpeed * direction;

    if (abs(arrowX - targetX) < animationSpeed) {
      arrowX = targetX;
      animating = false;
    }
  }

  if (arrowX !== null) {
    drawArrow(arrowX, height / 2 - 120);
  }
}

function drawArrow(x, y) {
  fill(255, 0, 0);
  noStroke();
  triangle(x - 10, y, x + 10, y, x, y + 20);
}

function startRandomSelection() {
  if (!animating) {
    let spacing = 80; // Samme som i draw()
    targetIndex = floor(random(data.length));
    targetX = 100 + targetIndex * spacing + offsetX;
    arrowX = 100 + offsetX;
    animating = true;
  }
}

function mousePressed() {
  dragging = true;
  lastMouseX = mouseX;
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (dragging && !animating) {
    let dx = mouseX - lastMouseX;
    offsetX += dx;
    lastMouseX = mouseX;

    if (arrowX !== null) {
      arrowX += dx;
    }
  }
}
