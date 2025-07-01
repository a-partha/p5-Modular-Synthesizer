let amplitude;                     
let frequency;                      
let phase = 0;                        
let osc;                            
let audioStarted = false;      

function setup() {
  const canvas = createCanvas(1000, 250);
  canvas.parent('osc-sketch');

  // Initializing oscillator without starting it
  osc = new p5.Oscillator();
  osc.setType('sine');
}

function draw() {
  background('black');  

  // Mapping mouse position to control frequency and amplitude
  frequency = constrain(map(mouseX, 0, width, 1, 440), 1, 440);
  osc.freq(frequency);

  // Checking if cursor is outside canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    // Muting oscillator when outside
    amplitude = 0;
  } else {
    // Mapping mouse position when inside
    amplitude = constrain(map(mouseY, 0, height, 0, 100), 0, 100);
  }
  osc.amp(amplitude);

  // Displaying current values
  fill('white');
  textSize(17);
  text('Frequency: ' + frequency, 50, 40);
  text('Amplitude: ' + amplitude, 50, 60);

  drawWave();
}

function drawWave() {
  stroke('white');                   
  strokeWeight(1.5);                 
  noFill();                          

  beginShape();
  for (let x = 0; x < width; x += 5) {
    // Calculating y position based on sine wave's formula
    const y = height / 2 + sin(TWO_PI * (x / width) * frequency + phase) * amplitude;
    vertex(x, y);
  }
  endShape();

  phase += 0.05;
}

function mousePressed() {
  // Resuming audio  and starting oscillator on first click
  if (!audioStarted) {
    userStartAudio();
    osc.start();
    audioStarted = true;
  }
}
