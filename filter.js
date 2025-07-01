let noise;                  
let filt;                   
let fft;                    
let freq = 440;             
let type = '';
let audioStarted = false;   

function setup() {
    const canvas = createCanvas(1015, 200);
    canvas.parent('filter-sketch');

    filt = new p5.LowPass();

    // Initializing noise without starting
    noise = new p5.Noise();
    noise.disconnect();           
    noise.connect(filt);          
    filt.freq(freq);              

    // Initializing FFT and setting input to the filter
    fft = new p5.FFT();
    fft.setInput(filt);           
}

function draw() {
    background(220);

    const spectrum = fft.analyze();
    noStroke();
    fill('black');

    // Drawing the plot
    for (let i = 0; i < spectrum.length; i++) {
        const x = map(i, 0, spectrum.length, 0, width);
        const h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h);
    }

    if (type) {
      stroke('black');
      textSize(17);
      text('Filter Type: ' + type, 20, 40);
    }
}

function toggleFilterType() {
    // Resuming audio and starting noise on first user click
    if (!audioStarted) {
        userStartAudio();                
        noise.start();                   
        noise.amp(0.4);                  
        audioStarted = true;             
    }

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

    fft.setInput(filt);        
}
