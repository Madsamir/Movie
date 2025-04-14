let server = "https://tdb01.ruc.dk/tdb-api/?q=";
let data = [];
let posterImages = [];

function setup() {
  createCanvas(1600, 800); // Increased canvas size for more room
  textAlign(CENTER, CENTER);
  textSize(12);
  loadJSON(server + 
    "select rating, year, poster FROM movie where (year, rating) IN (select year, MAX(rating) from movie where year BETWEEN 2000 and 2024 GROUP BY year) ORDER BY year ASC", 
    gotData);
}

function gotData(result) {
  data = result;

  // Load the posters after the data is fetched
  for (let i = 0; i < data.length; i++) {
    if (data[i].poster) {
      posterImages.push(loadImage(data[i].poster)); // Load the poster image
    } else {
      posterImages.push(null); // If no poster is available, push null
    }
  }
}

function draw() {
  background(240);

  if (data.length === 0) {
    text("Loading data...", width / 2, height / 2);
    return;
  }

  let startYear = 2000;
  let endYear = 2024;

  // Adjust X-spacing based on the canvas size
  let xSpacing = (width - 100) / (endYear - startYear); 

  // Draw timeline line
  stroke(50);
  line(50, height - 100, width - 50, height - 100); 

  // Draw movie posters and years with vertical spacing
  for (let i = 0; i < data.length; i++) {
    let x = map(data[i].year, startYear, endYear, 50, width - 50); // Map years to X positions

    // Place posters above the timeline (adjusted y position)
    let y = height - 150;

    // Check for poster collisions and adjust vertical spacing if needed
    for (let j = 0; j < i; j++) {
      if (abs(x - map(data[j].year, startYear, endYear, 50, width - 50)) < 50) {
        y += 50; // Move poster down if too close to another
      }
    }

    // Draw year markers on the timeline
    fill(0);
    text(data[i].year, x, height - 80); // Adjusted Y position for years

    // Draw the movie poster image
    if (posterImages[i]) {
      image(posterImages[i], x - 30, y, 60, 90); // Draw the poster (adjust size as needed)
    }
  }

  // Title for the timeline
  textSize(16);
  text("Highest Rated Movies (2000–2024)", width / 2, 30);
}
