let server = "https://tdb01.ruc.dk/tdb-api/?q=";
let data = [];
let posterImages = [];
let years = [];

let offsetX = 0;
let dragging = false;
let lastMouseX = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(12);
  loadJSON(server + 
    "select rating, year, poster FROM movie where (year, rating) IN (select year, MAX(rating) from movie where year BETWEEN 2000 and 2024 GROUP BY year) ORDER BY year ASC", 
    gotData);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function gotData(result) {
  data = result;
  for (let i = 0; i < data.length; i++) {
    let posterURL = data[i].poster;
    if (posterURL) {
      loadImage(posterURL, img => {
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
  stroke(0);
  line(0, height / 2, width, height / 2);

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
  } else {
    text("Indlæser plakater...", width / 2, height / 2);
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
  if (dragging) {
    let dx = mouseX - lastMouseX;
    offsetX += dx;
    lastMouseX = mouseX;
  }
}
