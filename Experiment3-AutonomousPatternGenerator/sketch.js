let maxYchange = 80;
let layers     = 15;
let rotStripe  = 1.2;
let lines      = true;
let alph       = 55;
let sw         = 1.2;
let darkPalette = [
  [6,   6,   6  ],
  [22,  22,  22 ],
  [55,  55,  55 ],
  [105, 105, 108],
  [172, 175, 178],
];
let accentLayer = 3;

function setup() {
  let canv = createCanvas(windowWidth - 20, windowHeight - 20);
  canv.mousePressed(drawSketch);
  angleMode(DEGREES);
  drawSketch();
}

function step(big) {
  let base = big ? random(2, 12) : random(5, maxYchange);
  return base - random(0, 15);
}

function drawSketch() {
  background(0);
  let yStop = height / 2 + 500;
  for (let i = 0; i < layers; i++) {
    let y1 = (i === 0) ? -height / 2 - 300 : -height / 2 + (height / layers) * i;
    let y2 = y1, y3 = y1, y4 = y1, y5 = y1, y6 = y1;
    let rotLayer      = random(359);
    let rotThisStripe = 0;
    let isAccent      = (i === accentLayer);
    while (y1 < yStop || y2 < yStop || y3 < yStop ||
           y4 < yStop || y5 < yStop || y6 < yStop) {
      y1 += max(1, step(isAccent));
      y2 += max(1, step(false));
      y3 += max(1, step(false));
      y4 += max(1, step(false));
      y5 += max(1, step(false));
      y6 += max(1, step(false));
      let r, g, b, a;
      if (isAccent) {
        r = 245; g = 245; b = 245; a = 220;
      } else {
        let col = floor(random(12));
        if      (col < 4)  { [r,g,b] = darkPalette[0]; }
        else if (col < 7)  { [r,g,b] = darkPalette[1]; }
        else if (col < 9)  { [r,g,b] = darkPalette[2]; }
        else if (col < 11) { [r,g,b] = darkPalette[3]; }
        else               { [r,g,b] = darkPalette[4]; }
        a = alph;
      }
      fill(r, g, b, a);
      if (lines) { stroke(0, 0, 0, 160); strokeWeight(sw); }
      else       { noStroke(); }
      push();
      translate(width / 2, height / 2);
      rotThisStripe += rotStripe;
      rotate(rotThisStripe + rotLayer);
      let xStart = -width / 2;
      drawStripe(xStart, y1, y2, y3, y4, y5, y6);
      pop();
      if (!isAccent && random() < 0.06) {
        noStroke();
        fill(200, 200, 200, 15);
        push();
        translate(width / 2 + random(2, 6), height / 2);
        rotate(rotThisStripe + rotLayer);
        drawStripe(xStart, y1, y2, y3, y4, y5, y6);
        pop();
        fill(255, 255, 255, 10);
        push();
        translate(width / 2 - random(2, 5), height / 2);
        rotate(rotThisStripe + rotLayer);
        drawStripe(xStart, y1, y2, y3, y4, y5, y6);
        pop();
      }
    }
  }
}

function drawStripe(xStart, y1, y2, y3, y4, y5, y6) {
  beginShape();
  curveVertex(xStart - 300,          height / 2 + 500);
  curveVertex(xStart - 300,          y1);
  curveVertex(xStart + (width/5)*1,  y2);
  curveVertex(xStart + (width/5)*2,  y3);
  curveVertex(xStart + (width/5)*3,  y4);
  curveVertex(xStart + (width/5)*4,  y5);
  curveVertex(width / 2 + 300,       y6);
  curveVertex(width / 2 + 300,       height / 2 + 500);
  endShape(CLOSE);
}