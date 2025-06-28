let durationSlider;
let beatLengthSlider, beatRateSlider, beatFrequencySlider;
let freqSlider, ampSlider;
let noise, filt, lfo;
let main_osc, lfo1, lfo2;
let freq1Slider, amt1Slider, freq2Slider, amt2Slider;

function setup() {
  createCanvas(1,1);               // Creating dummy canvas

  // Creating envelope and oscillator for click beat if needed
  noise = new p5.Noise();
  noise.disconnect();
  filt = new p5.Filter('bandpass');
  noise.connect(filt);
  filt.freq(400);
  noise.stop();

  // Selecting sliders
  durationSlider = select('#durationSlider');
  beatLengthSlider = select('#beatLengthSlider');
  beatRateSlider = select('#beatRateSlider');
  beatFrequencySlider = select('#beatFrequencySlider');
  freqSlider = select('#audioRateSlider');
  ampSlider = select('#audioAmountSlider');
  freq1Slider = select('#L1F_Slider');
  amt1Slider = select('#L1A_Slider');
  freq2Slider = select('#L2F_Slider');
  amt2Slider = select('#L2A_Slider');

  // Setting up LFOs and main oscillator
  lfo = new p5.Oscillator('sine');
  lfo.start();
  lfo.disconnect();
  filt.freq(lfo);

  lfo1 = new p5.Oscillator('sine');
  lfo1.start();
  lfo1.disconnect();
  lfo2 = new p5.Oscillator('sine');
  lfo2.start();
  lfo2.disconnect();
  main_osc = new p5.Oscillator('sine');
  main_osc.start();
  main_osc.amp(0);

  // Adding event listeners to sliders
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

  // Starting click beat
  setInterval(playClickBeat, beatRateSlider.value());
}

function draw() {
  // Updating modulations
  lfo.freq(freqSlider.value());
  lfo.amp(ampSlider.value());
  lfo1.freq(freq1Slider.value());
  lfo1.amp(amt1Slider.value());
  lfo2.freq(freq2Slider.value());
  lfo2.amp(amt2Slider.value());
}

function playNote(note) {
  // Creating new oscillator for this note
  const noteOsc = new p5.Oscillator('sine');
  noteOsc.start();

  // Setting frequency from MIDI note
  const freqVal = midiToFreq(note);
  noteOsc.freq(freqVal);

  // Creating new envelope for this note
  const noteEnv = new p5.Envelope();
  noteEnv.setADSR(0.1, durationSlider.value(), 0.1, 0.5);
  noteEnv.setRange(0.5, 0);
  noteEnv.play(noteOsc, 0, 0.1);

  // Stopping oscillator after release
  setTimeout(() => {
    noteOsc.stop();             // Stopping oscillator
  }, (durationSlider.value() + 0.5) * 1000);
}

function playClickBeat() {
  // Playing a click if not already playing
  const clickOsc = new p5.Oscillator('sine');
  clickOsc.start();
  clickOsc.freq(beatFrequencySlider.value());
  setTimeout(() => {
    clickOsc.stop();            // Stopping click sound
  }, beatLengthSlider.value());
}

function toggleNoise() {
  // Toggling noise on/off
  if (noise.isPlaying()) {
    noise.stop();
  } else {
    noise.start();
  }
}

function toggleMainOscillator() {
  // Toggling main oscillator on/off
  if (main_osc.amp().value > 0) {
    main_osc.amp(0);
  } else {
    main_osc.amp(0.2);
  }
}

function updateDuration() {
  select('#durationValue').html(durationSlider.value());
}
function updateBeatLength() {
  select('#beatLengthValue').html(beatLengthSlider.value());
}
function updateBeatRate() {
  select('#beatRateValue').html(beatRateSlider.value());
}
function updateBeatFrequency() {
  select('#beatFrequencyValue').html(beatFrequencySlider.value());
}
function updateAudioRate() {
  select('#audioRateValue').html(freqSlider.value());
}
function updateAudioAmount() {
  select('#audioAmountValue').html(ampSlider.value());
}
function updateL1F() {
  select('#L1F_Value').html(freq1Slider.value());
}
function updateL1A() {
  select('#L1A_Value').html(amt1Slider.value());
}
function updateL2F() {
  select('#L2F_Value').html(freq2Slider.value());
}
function updateL2A() {
  select('#L2A_Value').html(amt2Slider.value());
}
