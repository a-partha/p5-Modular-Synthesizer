
let midiNotes = [61, 63, 64, 68, 69, 66]; // MIDI notes of the melody sequence
let envelope;
let osc;
let circles = []; // Array to store circles
let noteIndex = 0;
let noteStartTime;
let framesPerNote = 60;
let isPlaying = false;
let type=[];
let firstClick = false;

function setup() {

  canvas2=createCanvas(1375, 400);
  canvas2.parent('seq1-sketch');

  envelope = new p5.Envelope();
  osc = new p5.Oscillator();
  osc.setType('sine');

  envelope.setADSR(0.1, 0.5, 0.1, 0.5);
  envelope.setRange(0.5, 0);

  osc.start();
  osc.amp(0);

  noteStartTime = millis();

  const button=document.getElementById('button1')
  button.addEventListener('click',toggle)
}

function draw() {
    background('rgba(0, 0, 0, 0.851)');
    if (firstClick && isPlaying) {
      playMIDINotes();
      drawCircles();
    }
    displayButtonText();
    
  }


function toggle() {
    isPlaying = !isPlaying;
    firstClick = true;
       
    if (isPlaying) {
      noteStartTime = millis();
      type="Playing";
      
    } else {
      // If pausing, reset circles
      resetCircles();
      type="Paused";
      
    }
}

function displayButtonText() {
    noStroke();
    textSize(17);
    fill('white');
    text(type, 20, 40);
  }

function playMIDINotes() {
  let framesPerNote = 60; 
  let noteDuration = 0.3;

  if (frameCount % framesPerNote === 0 && noteIndex < midiNotes.length) {
    let frequency = midiToFreq(midiNotes[noteIndex]);
    osc.freq(frequency);
    envelope.play(osc, 0, 0.1);

    let newCircle = {
      yPos: map(circles.length + 1, 0, 6, 0, height - 100),
      xPos: random(100, width - 100),
      diameter: map(midiNotes[noteIndex], min(midiNotes), max(midiNotes), 30, 70),
    };

    circles.push(newCircle);
    noteIndex++;

    if (noteIndex === midiNotes.length) {
      // Reset after displaying all 6 circles
      noteIndex = 0;
      setTimeout(resetCircles, noteDuration * 1000);
    }
  }
}

function resetCircles() {
    
  circles = [];
}

function drawCircles() {
  fill('white');
  stroke(131, 123, 143);
  strokeWeight(5);

  circles.forEach(circle => {
    ellipse(circle.xPos, circle.yPos, circle.diameter, circle.diameter);
  });
}