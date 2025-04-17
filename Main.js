let server = "https://tdb01.ruc.dk/tdb-api/?q=";
let data = [];
let posterImages = [];
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(12);

  loadJSON(
    server +
      "select rating, year, poster FROM movie where (year, rating) IN (select year, MAX(rating) from movie where year BETWEEN 2000 and 2024 GROUP BY year) ORDER BY year ASC",
    gotData
  );

  randomButton = createButton("Random");
  randomButton.position(20, 20);
  randomButton.mousePressed(startRandomSelection);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function gotData(result) {
  data = result;
  for (let i = 0; i < data.length; i++) {
    let posterURL = data[i].poster;
    if (posterURL) {
      loadImage(posterURL, (img) => {
        posterImages[i] = img;
      });
    }
    years[i] = data[i].year;
  }
}

function draw() {
  background(255);
  fill(0);

  // Draw timeline line
  if (data.length > 0) {
    let spacing = 120;
    let startX = 100 + offsetX;
    let endX = startX + (data.length - 1) * spacing;

    stroke(0);
    line(startX, height / 2, endX, height / 2);
  }

  if (posterImages.length === data.length) {
    let spacing = 120;

    for (let i = 0; i < data.length; i++) {
      let x = 100 + i * spacing + offsetX;
      let y = height / 2;

      if (x > -100 && x < width + 100) {
        noStroke();
        fill(0);
        text(years[i], x, y + 80);
        text("★ " + nf(data[i].rating, 1, 1), x, y + 100);

        if (posterImages[i]) {
          let img = posterImages[i];
          let imgW = 50;
          let imgH = 75;
          image(img, x - imgW / 2, y - imgH - 20, imgW, imgH);
        }

        stroke(0);
        fill(255);
        ellipse(x, y, 10, 10);
      }
    }

    // Animate arrow if active
    if (animating && arrowX !== null && targetX !== null) {
      let direction = targetX > arrowX ? 1 : -1;
      arrowX += animationSpeed * direction;

      // Stop when we're close enough
      if (abs(arrowX - targetX) < animationSpeed) {
        arrowX = targetX;
        animating = false;
      }
    }
    // Draw arrow
    if (arrowX !== null) {
      drawArrow(arrowX, height / 2 - 120);
    }
  } else {
    text("Indlæser plakater...", width / 2, height / 2);
  }
}

function drawArrow(x, y) {
  fill(255, 0, 0);
  noStroke();
  triangle(x - 10, y, x + 10, y, x, y + 20);
}

function startRandomSelection() {
  if (!animating) {
    let spacing = 120;
    targetIndex = floor(random(data.length)); // Pick random movie
    targetX = 100 + targetIndex * spacing + offsetX;
    arrowX = 100 + offsetX; // Start animation from the beginning
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

    // If arrow is placed, move it too
    if (arrowX !== null) {
      arrowX += dx;
    }
  }
}
