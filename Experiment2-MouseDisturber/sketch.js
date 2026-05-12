var FORCE_RADIUS = 120;
var NUM_COLS = 17;
var NUM_ROWS = 10;
var MODE = 1;

var SYMBOLS = ['★','◆','○','△','✦','✧','✱','☽','⊕','⌘','∞','⬡','✕','◇'];

var particles = [];
var t = 0;


class Particle {

  constructor(startX, startY) {
    this.ox = startX;
    this.oy = startY;
    this.x  = startX;
    this.y  = startY;
    this.vx = 0;
    this.vy = 0;
    this.symbol = random(SYMBOLS);
    this.size   = random(13, 21);
    this.hue    = random(360);
    this.angle  = 0;
  }

  reset() {
    this.x     = this.ox;
    this.y     = this.oy;
    this.vx    = 0;
    this.vy    = 0;
    this.angle = 0;
    this.symbol = random(SYMBOLS);
  }

  update() {
    var dx   = this.x - mouseX;
    var dy   = this.y - mouseY;
    var dist = sqrt(dx * dx + dy * dy);

    if (MODE === 1) {

      if (dist < FORCE_RADIUS && dist > 0) {
        var force = pow((FORCE_RADIUS - dist) / FORCE_RADIUS, 1.5) * 9;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
      this.vx += (this.ox - this.x) * 0.025;
      this.vy += (this.oy - this.y) * 0.025;
      this.vx *= 0.78;
      this.vy *= 0.78;
      this.x += this.vx;
      this.y += this.vy;

      var spd = sqrt(this.vx * this.vx + this.vy * this.vy);
      this.hue = (spd * 15) % 360;
      this.angle = atan2(this.vy, this.vx);

    } else if (MODE === 2) {

      if (dist < FORCE_RADIUS && dist > 0) {
        var pull = pow((FORCE_RADIUS - dist) / FORCE_RADIUS, 2) * 6;
        this.vx -= (dx / dist) * pull;
        this.vy -= (dy / dist) * pull;
        this.vx *= 0.70;
        this.vy *= 0.70;
      } else {
        this.vx += (this.ox - this.x) * 0.06;
        this.vy += (this.oy - this.y) * 0.06;
        this.vx *= 0.75;
        this.vy *= 0.75;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.angle += 0.03;

      var prox = constrain(1 - dist / FORCE_RADIUS, 0, 1);
      this.hue = 200 + prox * 160;

    } else if (MODE === 3) {

      var dox      = this.ox - mouseX;
      var doy      = this.oy - mouseY;
      var homeDist = sqrt(dox * dox + doy * doy);

      var displacement = sin(homeDist * 0.06 - t * 4) * 28 * exp(-homeDist / 160);

      var nx = dox / (homeDist || 1);
      var ny = doy / (homeDist || 1);
      var tx = this.ox - ny * displacement;
      var ty = this.oy + nx * displacement;

      this.x = lerp(this.x, tx, 0.18);
      this.y = lerp(this.y, ty, 0.18);

      this.angle = displacement * 0.04;
    }
  }

  display() {
    var dx   = this.x - mouseX;
    var dy   = this.y - mouseY;
    var dist = sqrt(dx * dx + dy * dy);
    var prox = constrain(1 - dist / FORCE_RADIUS, 0, 1);
    var sz   = this.size + prox * 9;

    push();
      translate(this.x, this.y);
      rotate(this.angle);
      textAlign(CENTER, CENTER);
      noStroke();
      textSize(sz);

      if (MODE === 1) {
        var spd = sqrt(this.vx * this.vx + this.vy * this.vy);
        if (spd > 0.5) {
          fill(this.hue, 80, 65);
        } else {
          fill(120);
        }
      } else if (MODE === 2) {
        if (prox > 0.05) {
          fill(this.hue, 80, 65);
        } else {
          fill(100);
        }
      } else {
        var moved = abs(this.x - this.ox) + abs(this.y - this.oy);
        var brightness = int(70 + min(moved * 3, 130));
        fill(brightness);
      }

      text(this.symbol, 0, 0);
    pop();
  }
}


function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 5);
  textFont('monospace');

  var spacingX = width  / (NUM_COLS + 1);
  var spacingY = height / (NUM_ROWS + 1);

  for (var row = 1; row <= NUM_ROWS; row++) {
    for (var col = 1; col <= NUM_COLS; col++) {
      particles.push(new Particle(col * spacingX, row * spacingY));
    }
  }
}


function draw() {
  background(0, 0, 5);

  noFill();
  stroke(0, 0, 100, 10);
  strokeWeight(1);
  circle(mouseX, mouseY, FORCE_RADIUS * 2);

  t += 0.016;

  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
  }
}


function mousePressed() {
  background(0, 0, 5);
  for (var i = 0; i < particles.length; i++) {
    particles[i].reset();
  }
}


function keyPressed() {
  if (key === '1') MODE = 1;
  if (key === '2') MODE = 2;
  if (key === '3') MODE = 3;
}2