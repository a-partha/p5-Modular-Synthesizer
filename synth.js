// Declaring variables for sliders, oscillators, filters, and interval ID
let durationSlider;
let beatLengthSlider, beatRateSlider, beatFrequencySlider;
let freqSlider, ampSlider;
let noise, filt, lfo;
let main_osc, lfo1, lfo2;
let freq1Slider, amt1Slider, freq2Slider, amt2Slider;
let clickIntervalID;
let noiseOn = false;                    // Tracking noise on/off state

function setup() {
  createCanvas(1, 1);                   // Creating invisible canvas

  // Creating noise source and configuring band-pass filter
  noise = new p5.Noise('white');
  noise.disconnect();
  noise.amp(0);                         // Setting initial noise gain to zero
  filt = new p5.Filter('bandpass');
  filt.process(noise);                  // Routing noise through filter
  filt.freq(400);                       // Setting filter center frequency
  noise.stop();                         // Ensuring noise is off initially

  // Selecting sliders for filter modulation
  freqSlider = select('#audioRateSlider');
  ampSlider  = select('#audioAmountSlider');

  // Starting LFO for filter cutoff modulation
  lfo = new p5.Oscillator('sine');
  lfo.start();
  lfo.disconnect();
  filt.freq(lfo);                       // Connecting LFO to filter freq

  // Selecting remaining sliders from DOM
  durationSlider      = select('#durationSlider');
  beatLengthSlider    = select('#beatLengthSlider');
  beatRateSlider      = select('#beatRateSlider');
  beatFrequencySlider = select('#beatFrequencySlider');
  freq1Slider         = select('#L1F_Slider');
  amt1Slider          = select('#L1A_Slider');
  freq2Slider         = select('#L2F_Slider');
  amt2Slider          = select('#L2A_Slider');

  // Starting LFO1 and LFO2 for main oscillator modulation
  lfo1 = new p5.Oscillator('sine');
  lfo1.start();
  lfo1.disconnect();
  lfo2 = new p5.Oscillator('sine');
  lfo2.start();
  lfo2.disconnect();

  // Creating main oscillator and nesting LFOs
  main_osc = new p5.Oscillator('sine');
  main_osc.freq(lfo1);
  main_osc.start();
  main_osc.amp(0);
  lfo1.freq(lfo2);

  // Attaching input handlers to sliders
  durationSlider.input(updateDuration);
  beatLengthSlider.input(updateBeatLength);
  beatRateSlider.input(updateBeatRate);
  beatFrequencySlider.input(updateBeatFrequency);
  freqSlider.input(updateAudioRate);
  ampSlider.input(updateAudioAmount);
  freq1Slider.input(updateL1F);
  amt1Slider.input(updateL1A);
  freq2Slider.input(updateL2F);
  amt2Slider.input(updateL2A);

  // Starting click-beat interval
  clickIntervalID = setInterval(playClickBeat, +beatRateSlider.value());
}

function draw() {
  // Updating filter LFO rate and amplitude
  lfo.freq(+freqSlider.value());
  lfo.amp(+ampSlider.value());

  // Updating carrier LFO1 rate and amplitude
  lfo1.freq(+freq1Slider.value());
  lfo1.amp(+amt1Slider.value());

  // Updating carrier LFO2 rate and amplitude
  lfo2.freq(+freq2Slider.value());
  lfo2.amp(+amt2Slider.value());
}

function playNote(note) {
  // Creating oscillator and envelope for note
  const noteOsc = new p5.Oscillator('sine');
  noteOsc.start();
  noteOsc.freq(midiToFreq(note));

  const noteEnv = new p5.Envelope();
  noteEnv.setADSR(0.1, +durationSlider.value(), 0.1, 0.5);
  noteEnv.setRange(0.5, 0);
  noteEnv.play(noteOsc, 0, 0.1);

  // Scheduling note stop after release
  setTimeout(() => {
    noteOsc.stop();
  }, (+durationSlider.value() + 0.5) * 1000);
}

function playClickBeat() {
  // Creating and playing click sound
  const clickOsc = new p5.Oscillator('sine');
  clickOsc.start();
  clickOsc.freq(+beatFrequencySlider.value());
  setTimeout(() => {
    clickOsc.stop();
  }, +beatLengthSlider.value());
}

function toggleNoise() {
    // Resuming context after the user clicked the checkbox
  // Toggling noise on/off using flag
  if (noiseOn) {
    noiseOn = false;
    noise.amp(0, 0.1);                  // Ramping noise gain down
    setTimeout(() => noise.stop(), 100);
  } else {
    noiseOn = true;
    noise.start();
    noise.amp(0.2, 0.1);                // Ramping noise gain up
  }
}

function toggleMainOscillator() {
  // Toggling main oscillator amplitude
  if (main_osc.getAmp() > 0) {
    main_osc.amp(0);
  } else {
    main_osc.amp(0.2);
  }
}

function updateDuration() {
  // Updating displayed duration value
  select('#durationValue').html(durationSlider.value());
}

function updateBeatLength() {
  // Updating displayed beat length value
  select('#beatLengthValue').html(beatLengthSlider.value());
}

function updateBeatRate() {
  // Updating displayed beat rate and resetting interval
  select('#beatRateValue').html(beatRateSlider.value());
  clearInterval(clickIntervalID);
  clickIntervalID = setInterval(playClickBeat, +beatRateSlider.value());
}

function updateBeatFrequency() {
  // Updating displayed beat frequency value
  select('#beatFrequencyValue').html(beatFrequencySlider.value());
}

function updateAudioRate() {
  // Updating displayed filter modulation rate
  select('#audioRateValue').html(freqSlider.value());
}

function updateAudioAmount() {
  // Updating displayed filter modulation intensity
  select('#audioAmountValue').html(ampSlider.value());
}

function updateL1F() {
  // Updating displayed LFO1 frequency value
  select('#L1F_Value').html(freq1Slider.value());
}

function updateL1A() {
  // Updating displayed LFO1 amplitude value
  select('#L1A_Value').html(amt1Slider.value());
}

function updateL2F() {
  // Updating displayed LFO2 frequency value
  select('#L2F_Value').html(freq2Slider.value());
}

function updateL2A() {
  // Updating displayed LFO2 amplitude value
  select('#L2A_Value').html(amt2Slider.value());
}
