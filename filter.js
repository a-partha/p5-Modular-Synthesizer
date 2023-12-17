let noise;
let filt;
let freq = 440;
let fft;
let type='Low Pass Filter';


function setup() {
    var canvas = createCanvas(1375, 200);
    canvas.parent('filter-sketch');
    filt = new p5.LowPass();

    noise = new p5.Noise();
    noise.disconnect();
    noise.connect(filt);
    filt.freq(freq);
    noise.start();
    noise.amp(0.05);
    // Fast Fourier Transform (FFT) for visualization
    fft = new p5.FFT();

}

function draw() {
    background(220);

    // Visualize the FFT
    let spectrum = fft.analyze();
    noStroke();
    fill('black');
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h);
       
    }
    stroke('black');
    textSize(17);
    text('Filter Type: '+ type, 20, 40);

  }


function toggleFilterType() {
    // Toggle between LowPass and HighPass filters
    if (filt instanceof p5.LowPass) {
        // If it's a Low-Pass filter, switch to High-Pass
        filt = new p5.HighPass();
        type='High Pass Filter';
  
       
    } else {
        // If it's a High-Pass filter, switch to Low-Pass
        filt = new p5.LowPass();
        type='Low Pass Filter';
    }

    // Disconnect and reconnect noise to apply new filter type
    noise.disconnect();
    noise.connect(filt);
    filt.freq(freq);

}
