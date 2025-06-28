let midiNotes = [61, 63, 64, 68, 69, 66]; // Defining MIDI notes of the melody sequence
let envelope;                            
let osc;                                
let circles = [];                       
let noteIndex = 0;                      
let noteStartTime;                      
let isPlaying = false;                  
let type = ''; // Tracking button text state
let firstClick = false;                  
function setup() {
  // Creating canvas for visualization
  const canvas2 = createCanvas(1000, 250);
  canvas2.parent('seq1-sketch');

  // Creating envelope and oscillator without starting oscillator
  envelope = new p5.Envelope();
  osc = new p5.Oscillator();
  osc.setType('sine');

  // Configuring envelope ADSR and range
  envelope.setADSR(0.1, 0.5, 0.1, 0.5);
  envelope.setRange(0.5, 0);

  // Starting oscillator silently
  osc.start();
  osc.amp(0);

  // Initializing note start time
  noteStartTime = millis();

  // Adding click listener to toggle playback
  const button = document.getElementById('button1');
  button.addEventListener('click', toggle);
}

function draw() {
  background('rgba(0, 0, 0, 0.851)');

  // Playing notes and drawing circles only after first click and while sequence is playing
  if (firstClick && isPlaying) {
    playMIDINotes();
    drawCircles();
  }

  displayButtonText();
}

function toggle() {
  // Resuming audio on first click
  if (!firstClick) {
    userStartAudio();    
    firstClick = true;  
  }

  // Toggling play/pause state
  isPlaying = !isPlaying;

  if (isPlaying) {
    noteStartTime = millis();  // Resetting start time when sequence is playing
    type = 'Playing';          
  } else {
    resetCircles(); // Clearing circles when paused
    type = 'Paused';           
  }
}

function displayButtonText() {
  noStroke();
  textSize(17);
  fill('white');
  text(type, 20, 40);  // Displaying current button text state
}

function playMIDINotes() {
  let framesPerNote = 60;  // Number of frames per note
  let noteDuration = 0.3;  // Duration of each note (seconds)

  // Checking whether to play the next note
  if (frameCount % framesPerNote === 0 && noteIndex < midiNotes.length) {
    let frequency = midiToFreq(midiNotes[noteIndex]);  // Converting MIDI to frequency
    osc.freq(frequency); // Setting oscillator frequency
    envelope.play(osc, 0, 0.1); // Triggering the envelope

    // Creating new circle
    let newCircle = {
      yPos: map(circles.length + 1, 0, 6, 0, height - 100),
      xPos: random(100, width - 100),
      diameter: map(midiNotes[noteIndex], min(midiNotes), max(midiNotes), 30, 70),
    };

    circles.push(newCircle); // Adding new circle to array
    noteIndex++;

    // Resetting sequence after last note
    if (noteIndex === midiNotes.length) {
      noteIndex = 0;                        
      setTimeout(resetCircles, noteDuration * 1000);       
    }
  }
}

function resetCircles() {
  circles = [];  // Clearing circles array
}

function drawCircles() {
  fill('white');
  stroke(131, 123, 143);
  strokeWeight(5);               

  circles.forEach(circle => {
    ellipse(circle.xPos, circle.yPos, circle.diameter, circle.diameter);
  });
}
