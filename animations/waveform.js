
class Waveform {
    constructor(width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;

        this.prevLevels = new Array(60);
    }

    initialize(mic) {
        this.amplitude = new p5.Amplitude();
        this.amplitude.setInput(mic);
        this.amplitude.smooth(0.6);
    }

    draw(x, y) {
        let level = this.amplitude.getLevel();

        // rectangle variables
        let spacing = 10;
        let w = this.width/ (this.prevLevels.length * spacing);

        let minHeight = 2;
        let roundness = 20;

        // add new level to end of array
        this.prevLevels.push(level);

        // remove first item in array
        this.prevLevels.splice(0, 1);

        // loop through all the previous levels
        for (let i = 0; i < this.prevLevels.length; i++) {

            let x = map(i, this.prevLevels.length, 0, this.width/2, this.width);
            let h = map(this.prevLevels[i], 0, 0.5, minHeight, this.height);

            // let alphaValue = map(i, 0, this.prevLevels.length, 1, 250);

            // let hueValue = map(h, minHeight, this.height, 200, 255);

            fill(this.color);

            // fill(hueValue, 255, 255, alphaValue);

            rect(x, this.height/2, w, h);
            rect(this.width - x, this.height/2, w, h);
        }
    }
}

//var mic, soundFile;
//var amplitude;
//
//var prevLevels = new Array(60);

let waveform = new Waveform(800, 800, 'red');

function setup() {
    c = createCanvas(windowWidth, windowHeight);
    background(0);
    noStroke();
    rectMode(CENTER);
    colorMode(HSB);

    mic = new p5.AudioIn();
    mic.start();
    waveform.initialize(mic);


    //mic = new p5.AudioIn();
    //mic.start();

    //// load the sound, but don't play it yet
    //// soundFile = loadSound('../../music/Broke_For_Free_-_01_-_As_Colorful_As_Ever.mp3')

    //amplitude = new p5.Amplitude();
    //amplitude.setInput(mic);
    //amplitude.smooth(0.6);
}

function draw() {
    background(20, 20);
    fill(255, 10);
    waveform.draw(10, 10);
}
