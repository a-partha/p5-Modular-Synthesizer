let noise;                  
let filt;                   
let fft;                    
let freq = 440;             
let type = '';
let audioStarted = false;   

function setup() {
    // Creating canvas for visualization
    const canvas = createCanvas(1015, 200);
    canvas.parent('filter-sketch');

    // Initializing low-pass filter node
    filt = new p5.LowPass();

    // Initializing noise source without starting
    noise = new p5.Noise();
    noise.disconnect();           
    noise.connect(filt);          
    filt.freq(freq);              

    // Initializing FFT and setting its input to the filter
    fft = new p5.FFT();
    fft.setInput(filt);           
}

function draw() {
    background(220);

    // Analyzing frequency spectrum from the filter output
    const spectrum = fft.analyze();
    noStroke();
    fill('black');

    // Drawing spectrum bars across the canvas
    for (let i = 0; i < spectrum.length; i++) {
        const x = map(i, 0, spectrum.length, 0, width);
        const h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h);
    }

    // Displaying current filter type
    if (type) {
      stroke('black');
      textSize(17);
      text('Filter Type: ' + type, 20, 40);
    }
}

function toggleFilterType() {
    // Resuming audio context and starting noise on first user click
    if (!audioStarted) {
        userStartAudio();                
        noise.start();                   
        noise.amp(0.4);                  
        audioStarted = true;             
    }

    // Toggling between low-pass and high-pass filters
    if (filt instanceof p5.LowPass) {
        filt = new p5.HighPass();
        type = 'High Pass Filter';
    } else {
        filt = new p5.LowPass();
        type = 'Low Pass Filter';
    }

    // Reconnecting noise to the new filter and updating frequency
    noise.disconnect();        
    noise.connect(filt);       
    filt.freq(freq);           

    // Ensuring FFT listens to the updated filter node
    fft.setInput(filt);        
}
