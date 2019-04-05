// import utility functions
import rand from './utils/rand';
import randInt from './utils/randInt';
import randNormal from './utils/rand';
import normalPDF from './utils/normalPDF';

// setup 2D canvas for radio waves
var canvas = document.getElementById("doodle");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Determine x and y range
var xMin = 140;
var xMax = canvas.width - xMin;
var yMin = 100;
var yMax = canvas.height - yMin;

// Determine the number of lines and the number of points per line
var nLines = 80;
var nPoints = 80;
var mx = (xMin + xMax) / 2;
var dx = (xMax - xMin) / nPoints;
var dy = (yMax - yMin) / nLines;
var x = xMin;
var y = yMin;
ctx.moveTo(xMin, yMin);

// Style lines with a thin white stroke
ctx.fillStyle = "black";
ctx.strokeStyle = "white";
ctx.lineWidth = 1.2;

// Create 80 radio wave "lines"
for (var i = 0; i < nLines; i++) {
  ctx.beginPath();
  // Generate random parameters for the line's normal distribution
  var nModes = randInt(1, 4);
  var mus = [];
  var sigmas = [];
  for (var j = 0; j < nModes; j++) {
    mus[j] = rand(mx - 50, mx + 50);
    sigmas[j] = randNormal(24, 30);
  }

  var w = y;
  for (var k = 0; k < nPoints; k++) {
    x = x + dx;
    var noise = 0;
    for (var l = 0; l < nModes; l++) {
      noise += normalPDF(x, mus[l], sigmas[l]);
    }
    var yy =
      0.3 * w +
      0.7 * (y - 600 * noise + noise * Math.random() * 200 + Math.random());
    ctx.lineTo(x, yy);
    w = yy;
  }

  // Cover up the previous lines
  ctx.fill();

  // Draw the current line
  ctx.stroke();

  // Go to the next line
  x = xMin;
  y = y + dy;
  ctx.moveTo(x, y);
}

console.log("Finished!...");