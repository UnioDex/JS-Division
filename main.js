import normalPDF from "./utils/normalPDF.js";
import getNData from "./n.js";

let nData = getNData();

let dataId = 8888 - 1;

function getStandardDeviation(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
        array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
}

function mulberry32(a) {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function getAvg(grades) {
    const total = grades.reduce((acc, c) => acc + c, 0);
    return total / grades.length;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function draw() {
    let nArray = [];

    let nObj = nData[dataId][Object.keys(nData[dataId])[0]];

    nArray.push(nObj.first);
    nArray.push(nObj.second);
    nArray.push(nObj.third);
    nArray.push(nObj.forth);
    nArray.push(nObj.fifth);
    nArray.push(nObj.sixth);
    nArray.push(nObj.seventh);
    nArray.push(nObj.eight);

    let std = clamp(Math.round(getStandardDeviation(nArray)), 1, 4);
    let avg = Math.round(getAvg(nArray));
    let avg14 = Math.round(getAvg(nArray.slice(0, 5)));
    let avg48 = Math.round(getAvg(nArray.slice(4, 9)));

    // setup 2D canvas for radio waves
    var canvas = document.getElementById("doodle");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
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
        var nModes = std;
        var mus = [];
        var sigmas = [];
        for (var j = 0; j < nModes; j++) {
            sigmas[j] = avg * std;
            mus[j] = mx + mulberry32(i * avg * std) * 100 - 50;
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
                0.7 *
                (y -
                    600 * noise +
                    noise * mulberry32(avg14 * k) * 200 +
                    mulberry32(avg48 * k));
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
}

draw();

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submit();
});

function submit() {
    let doc = document.getElementById("n-id");
    dataId = parseInt(doc.value) - 1;
    draw();
}
