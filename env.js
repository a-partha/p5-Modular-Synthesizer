let noise;
let filt;
let freq = 400;

let env;
let slider;

// Default ADSR values
let attackTime = 0;
let decayTime = 0.5;
let sustainLevel = 1.0;
let releaseTime = 0;

function setup() {

  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, sustainLevel, releaseTime);

  filt = new p5.Filter();
  noise = new p5.Noise();
  noise.disconnect();
  noise.connect(filt);
  filt.freq(freq);
  noise.start();
  userStartAudio();  // Browser to unlock sound on interaction
  noise.amp(env);
}


function AttackPlay(a) {
  
  let newAttackTime = a;
  // Updating attack time
  attackTime = newAttackTime;
  env.setADSR(attackTime, decayTime, sustainLevel, releaseTime);
  env.play();
}
