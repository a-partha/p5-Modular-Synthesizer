let amplitude;                       // Defining amplitude variable
let frequency;                       // Defining frequency variable
let phase = 0;                       // Initializing phase for wave movement
let osc;                             // Declaring oscillator variable
let audioStarted = false;            // Tracking if audio has been started

function setup() {
  // Creating canvas for visualization
  const canvas = createCanvas(1000, 250);
  canvas.parent('osc-sketch');

  // Creating oscillator without starting it
  osc = new p5.Oscillator();
  osc.setType('sine');
}

function draw() {
  background('black');  

  // Mapping mouse position to control frequency and amplitude
  frequency = constrain(map(mouseX, 0, width, 1, 440), 1, 440);
  amplitude = constrain(map(mouseY, 0, height, 0, 100), 0, 100);
  osc.freq(frequency);
  osc.amp(amplitude);

  // Displaying current frequency and amplitude
  fill('white');
  textSize(17);
  text('Frequency: ' + frequency, 50, 40);
  text('Amplitude: ' + amplitude, 50, 60);

  // Drawing waveform based on sine function
  drawWave();
}

function drawWave() {
  stroke('white');                   // Setting stroke color for wave
  strokeWeight(1.5);                 // Setting stroke weight for wave
  noFill();                          // Disabling fill for wave shape

  beginShape();
  for (let x = 0; x < width; x += 5) {
    // Calculating y position based on sine wave formula
    const y = height / 2 + sin(TWO_PI * (x / width) * frequency + phase) * amplitude;
    vertex(x, y);
  }
  endShape();

  // Incrementing phase for animating wave
  phase += 0.05;
}

function mousePressed() {
  // Resuming audio context and starting oscillator on first click
  if (!audioStarted) {
    userStartAudio();
    osc.start();
    audioStarted = true;
  }
}
