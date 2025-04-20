let server = "https://tdb01.ruc.dk/tdb-api/?q=";
let data = [];
let posterImages = [];
let noPosterImg;
let years = [];
// holder øje med hvor meget du rykker til siden, med musen
let offsetX = 0;
// Boolean for at fortælle om du dragger med musen eller ej
let dragging = false;
// Opdater/Gemmer musens placering fra sidst.
let lastMouseX = 0;

// pilens start position 
let arrowX = null;
// Bruges til at holde position af den film pilen lander på
let targetIndex = null;
// Animation for pilen er false inditl man trykker på knappen og kører pilen. Så den tjekker om pilens animation er i gang
let animating = false;
// animation hastighed
let animationSpeed = 10;
// Variabler for pilens X-koordinat
let targetX = null;
// Variabel for vores knap
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
  posterImages[i] = loadImage(posterURL);
} else {
  posterImages[i] = noPosterImg;
}
   // samler alle filmenes årstal i en liste.
    years[i] = data[i].year;
  }



}

function draw() {
  background(255);
  stroke(0);
  line(0, height / 2, width, height / 2);


  let spacing = 70;
  // bestemmer positionerne for alle filmene
  for (let i = 0; i < data.length; i++) {
    let x = 100 + i * spacing + offsetX; // "offsetX" til at justere hele positionen. Man rykker tidslinjen 
    let y = height / 2;
    // Bestemmer hvilken "poster" der skal hentes. i bestemmer hvilket
    let img = posterImages[i];
    // Billede størrelse og position
    image(img, x - 25, y - 95, 50, 75);

    noStroke();
    fill(0);
    // Årstal
    text(data[i].year, x, y + 80);
    // Viser rating under årstal. Henter specifik rating med et heltal og decimal
    text("Rating" + nf(data[i].rating, 1, 1), x, y + 100);

    stroke(0);
    fill(255);
    ellipse(x, y, 10);
  }
 if (animating && arrowX !== null && targetX !== null) {
  let direction;
  // tjekker om pilens mål ligger til højre for pilens start position
  if (targetX > arrowX) {
    direction = 1; // Bevæg til højre
  }
  //flytter pilen
  arrowX = arrowX + animationSpeed * direction;

  // Tjekker om det er det samme
  if (arrowX === targetX) {
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
    let spacing = 70; // Samme som i draw()
    // vælger et tilfældigt 
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
