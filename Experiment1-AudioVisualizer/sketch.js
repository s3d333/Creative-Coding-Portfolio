let mic;
let fft;
let angle = 0;
let currentEffect = 1;


function setup() {
  createCanvas(800, 600);
  textFont('monospace');

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
}


function mousePressed() {
  userStartAudio();
}


function keyPressed() {
  if (key === '1') currentEffect = 1;
  if (key === '2') currentEffect = 2;
  if (key === '3') currentEffect = 3;
  if (key === '4') currentEffect = 4;
}


function draw() {
  let wave     = fft.waveform();
  let spectrum = fft.analyze();
  let vol      = mic.getLevel();

  if (currentEffect === 1) drawMirrorWaveform(wave, vol);
  if (currentEffect === 2) drawCircularSpectrum(spectrum, vol);
  if (currentEffect === 3) drawMountainRange(spectrum);
  if (currentEffect === 4) drawKaleidoscope(wave, vol);
}


function drawMirrorWaveform(wave, vol) {
  background(10);

  for (let flip = -1; flip <= 1; flip += 2) {
    noFill();
    beginShape();
    for (let i = 0; i < wave.length; i++) {
      let x = map(i, 0, wave.length, 0, width);
      let y = height / 2 + wave[i] * 150 * flip;

      let r = map(i, 0, wave.length, 255, 50);
      let g = map(wave[i], -1, 1, 50, 255);
      let b = map(i, 0, wave.length, 50, 255);

      stroke(r, g, b);
      strokeWeight(1.5);
      vertex(x, y);
    }
    endShape();
  }

  stroke(255, 255, 255, 150);
  strokeWeight(1);
  let lineWidth = map(vol, 0, 1, 0, width);
  line(width / 2 - lineWidth / 2, height / 2,
       width / 2 + lineWidth / 2, height / 2);
}


function drawCircularSpectrum(spectrum, vol) {
  background(10);

  let cx = width / 2;
  let cy = height / 2;

  angle += 0.003;

  let numBars     = 128;
  let innerRadius = 80;

  for (let i = 0; i < numBars; i++) {
    let idx       = floor(map(i, 0, numBars, 0, spectrum.length * 0.5));
    let barHeight = map(spectrum[idx], 0, 255, 0, 180);

    let a = map(i, 0, numBars, 0, TWO_PI) + angle;

    let x1 = cx + cos(a) * innerRadius;
    let y1 = cy + sin(a) * innerRadius;
    let x2 = cx + cos(a) * (innerRadius + barHeight);
    let y2 = cy + sin(a) * (innerRadius + barHeight);

    let r = map(cos(a), -1, 1, 50, 255);
    let g = map(sin(a), -1, 1, 50, 255);
    let b = map(barHeight, 0, 180, 255, 50);

    stroke(r, g, b);
    strokeWeight(2);
    line(x1, y1, x2, y2);
  }

  noFill();
  stroke(255, 80);
  strokeWeight(1);
  ellipse(cx, cy, innerRadius * 2 + vol * 80, innerRadius * 2 + vol * 80);
}


function drawMountainRange(spectrum) {
  background(10);

  let layers = [
    { color: [20,  20,  80],  offset: 60,  scale: 0.6 },
    { color: [20,  80,  120], offset: 30,  scale: 0.8 },
    { color: [50,  180, 200], offset: 0,   scale: 1.0 }
  ];

  for (let l = 0; l < layers.length; l++) {
    let layer = layers[l];

    fill(layer.color[0], layer.color[1], layer.color[2], 200);
    noStroke();

    beginShape();
    vertex(0, height);

    for (let i = 0; i < spectrum.length / 2; i++) {
      let x = map(i, 0, spectrum.length / 2, 0, width);
      let h = map(spectrum[i], 0, 255, 0, height * 0.7 * layer.scale);
      let y = height - h - layer.offset;
      vertex(x, y);
    }

    vertex(width, height);
    endShape(CLOSE);
  }

  stroke(100, 200, 255, 60);
  strokeWeight(1);
  line(0, height - 60, width, height - 60);
}


function drawKaleidoscope(wave, vol) {
  background(10);

  let cx       = width / 2;
  let cy       = height / 2;
  let segments = 8;

  angle += 0.005 + vol * 0.02;

  for (let s = 0; s < segments; s++) {
    push();
      translate(cx, cy);
      rotate((TWO_PI / segments) * s + angle);

      noFill();
      beginShape();
      for (let i = 0; i < wave.length / 2; i++) {
        let x = map(i, 0, wave.length / 2, 0, width / 2);
        let y = wave[i] * 100;

        let r = map(i, 0, wave.length / 2, 255, 50);
        let g = map(wave[i], -1, 1, 100, 255);
        let b = 200;

        stroke(r, g, b, 180);
        strokeWeight(1.5);
        vertex(x, y);
      }
      endShape();
    pop();
  }
}