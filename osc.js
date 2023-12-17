let amplitude;
let frequency;
let phase = 0;
let osc;

function setup() {
  var canvas = createCanvas(1375, 500);
  canvas.parent('osc-sketch'); 
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.start();
}

function draw() {
  background('black');  
  // Map the mouse position to control frequency and amplitude
  frequency = constrain(map(mouseX, 0, width, 1, 440), 1, 440);
  amplitude = constrain(map(mouseY, 0, height, 0, 100), 0, 100);
  osc.freq(frequency);
  osc.amp( amplitude);
  
  textSize(17);
  text('Frequency: ' + frequency, 50, 40);
  textSize(17);
  text('Amplitude: ' + amplitude, 50, 60);
  drawWave();
}


function drawWave() {
  stroke('white');
  strokeWeight(1.5);
  noFill();

  beginShape();
  for (let x = 0; x < width; x += 5) 
  {
    let y = height / 2 + sin(TWO_PI * (x / width) * frequency + phase) * amplitude;
    vertex(x, y);
  }
  endShape();

  phase += 0.05;// Control for movement speed
}