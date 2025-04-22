let server = "https://tdb01.ruc.dk/tdb-api/?q=";
let data = [];
let posterImages = [];
let noPosterImg;
let arrowImg; // Variabel til pilens billede
let years = [];

// pilens start position 
let arrowX = null;
// Bruges til at gemme hvilken film pilen skal lande på
let targetIndex = null;
// Animation for pilen er false indtil man trykker på knappen og kører pilen. Så den tjekker om pilens animation er i gang
let animating = false;
// animation hastighed
let animationSpeed = 10;
// Variable for pilens X-position
let targetX = null;
// Variabel for vores knap
let randomButton;

function preload() {
  noPosterImg = loadImage("Nosign.png");
  arrowImg = loadImage("Pil.png"); // Læs pilens billede
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
    let x = 30 + i * spacing; // Justeret X-position uden offsetX
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

    // Laver en cirkel for hver film
    stroke(0);
    fill(255);
    ellipse(x, y, 10);
  }

  // Pile-animation
  if (animating && arrowX !== null && targetX !== null) {
    let direction;
    if (targetX > arrowX) {
      direction = 1;
    } else {
      direction = -1;
    }

    arrowX = arrowX + animationSpeed * direction;

    if (arrowX === targetX) {
      animating = false;
    }
  }

  // Hvis pilen ikke er "null", og den har en gyldig position skal billedet tegnes
  if (arrowX !== null) {
    image(arrowImg, arrowX - 10, height / 2 - 130, 20, 40); 
  }
}

function startRandomSelection() {
  if (!animating) {
    let spacing = 70; // Samme som i draw()
    // vælger et tilfældigt film
    targetIndex = floor(random(data.length));
    targetX = 30 + targetIndex * spacing; // Justeret X-position
    arrowX = 30; // Starter fra venstre
    animating = true;
  }
}
