let midiNotes = [];
let env;
let osc;
let fft;
let durationSlider;

let noise;
let filt;
let freq = 400;
let lfo, freqSlider, ampSlider;
let note = 0;
let noiseOn = false; 
let mainOscOn = false;

let playing = false;
let beatLengthSlider, beatRateSlider, beatFrequencySlider;
let beatLength;
let beatRate;
let beatFrequency;
let beatInterval;

let main_osc;
let main_freq = 400;

let lfo1, freq1Slider, amt1Slider;
let lfo2, freq2Slider, amt2Slider;

function setup() {

  
  //envelope
  env = new p5.Envelope();
  osc = new p5.Oscillator();
  osc.setType('sine');
  // Start the oscillator but don't play it immediately
  osc.start();
  osc.amp(0);

  // Set the envelope parameters
  env.setADSR(0.1, 0.5, 0.1, 0.5);
  env.setRange(0.5, 0);

  // Create a slider for note duration
  durationSlider = select('#durationSlider');
  durationSlider.input(updateDuration);
  text('Note ');

  lfo = new p5.Oscillator();
  lfo.start();
  lfo.disconnect();

  filt = new p5.Filter('bandpass');
  noise = new p5.Noise();
  noise.disconnect();
  noise.connect(filt);
  filt.freq(lfo);
  // Ensure that the noise is off when the page is loaded
  noise.stop();
 
  

  lfo1 = new p5.Oscillator();
  lfo1.start();
  // so that lfo is not sent system audio
  lfo1.disconnect();

  
  lfo2 = new p5.Oscillator();
  lfo2.start();
  lfo2.disconnect();

 //Modulating an oscillator (main) output with a Low Frequency Oscillator (LFO1) which is controlled by another one (LFO2)!  
  main_osc = new p5.Oscillator();
  main_osc.freq(lfo1);
  lfo1.freq(lfo2);


  freqSlider = select('#audioRateSlider');
  freqSlider.input(updateAudioRate);
 
  ampSlider = select('#audioAmountSlider');
  ampSlider.input(updateAudioAmount);

  beatLengthSlider = select('#beatLengthSlider');
  beatLengthSlider.input(updateBeatLength);
  
  beatRateSlider = select('#beatRateSlider');
  beatRateSlider.input(updateBeatRate);

  beatFrequencySlider = select('#beatFrequencySlider');
  beatFrequencySlider.input(updateBeatFrequency);

  // Play the click beat on a loop
  beatInterval = setInterval(playClickBeat, beatRate); // Update to beatInterval

  freq1Slider = select('#L1F_Slider');
  freq1Slider.input(updateL1F);

  amt1Slider = select('#L1A_Slider');
  amt1Slider.input(updateL1A);

  freq2Slider = select('#L2F_Slider');
  freq2Slider.input(updateL2F);

  amt2Slider = select('#L2A_Slider');
  amt2Slider.input(updateL2A);
  

}

function draw() {
  lfo.freq(freqSlider.value());
  lfo.amp(ampSlider.value());
  filt.freq(lfo);
  lfo1.freq(freq1Slider.value());
  lfo1.amp(amt1Slider.value());
  lfo2.freq(freq2Slider.value());
  lfo2.amp(amt2Slider.value());
  // beatLengthSlider.value()
  // beatRateSlider.value()
  // beatFrequencySlider.value()
}

function playNote(note) {
  // Set the frequency of the oscillator based on the MIDI note
  let frequency = midiToFreq(note);
  osc.freq(frequency);

  // Set the duration based on the slider value
  let duration = durationSlider.value();

  // Set the envelope duration dynamically
  env.setADSR(0.1, duration, 0.1, 0.5);

  // Trigger the envelope to play the note
  env.play(osc, 0, 0.1);

  // Stop the sound after the envelope release phase
  setTimeout(() => {
    osc.amp(0); // To stop the sound
  }, duration * 1000);
}


function toggleNoise() {
  noiseOn = !noiseOn; // Toggle the state
  if (noiseOn) {
    noise.start(); // Start the noise
    noise.amp(0.2);
  } else {
    noise.stop(); // Stop the noise
    noise.amp(0);
  }
}


function toggleMainOscillator() {
  mainOscOn = !mainOscOn;

  if (mainOscOn) {
    
    main_osc.start();// Turn on the main oscillator
    main_osc.amp(0.2);
  
  } else {
    main_osc.amp(0); // Turn off the main oscillator
  }
}


// function playClickBeat() {
//   if (!playing) {
//     playClick();
//     // Update based on the current beatRateSlider value
//     clearInterval(beatInterval);
//     beatInterval = setInterval(playClickBeat, beatRateSlider.value());
//   }
// }

// function playClick() {
//   const clickSound = new p5.Oscillator();
//   clickSound.setType('sine');
//   clickSound.freq(beatFrequencySlider.value());
//   clickSound.start();

//   // Stop the beat after a short duration
//   setTimeout(() => {
//     clickSound.stop();
//   }, beatLengthSlider.value());
// }

function playClickBeat() {
  if (!playing) {
    playClick();
    // Update the interval dynamically based on the current beatRateSlider value
    console.log(beatRateSlider.value())
    clearInterval(beatInterval);
    beatInterval = setInterval(playClickBeat, beatRateSlider.value()); // Update to beatInterval
    // console.log(beatRateSlider.value())
  }
}

function playClick() {
  // Simulate a click sound (adjust as needed)
  const clickSound = new p5.Oscillator();
  clickSound.setType('sine');
  clickSound.freq(beatFrequencySlider.value());
  clickSound.start();

  // Stop the click sound after a short duration
  setTimeout(() => {
    clickSound.stop();
  }, beatLengthSlider.value());
}



function updateDuration() {
  select('#durationValue').html(durationSlider.value());
}

function updateAudioRate() {
  select('#audioRateValue').html(freqSlider.value());
}

function updateAudioAmount() {
  select('#audioAmountValue').html(ampSlider.value());
}

function updateBeatLength() {
  // Update the displayed duration value
  select('#beatLengthValue').html(beatLengthSlider.value());
}

function updateBeatRate() {
  select('#beatRateValue').html(beatRateSlider.value());
}

function updateBeatFrequency() {
  select('#beatFrequencyValue').html(beatFrequencySlider.value());
}

function updateL1F() {
  select('#L1F_Value').html(freq1Slider.value());
}

function updateL1A() {
  select('#L1A_Value').html(amt1Slider.value());
}

function updateL2F() {
  select('#L2F_Value').html(freq2Slider.value());

}function updateL2A() {
  select('#L2A_Value').html(amt2Slider.value());
}