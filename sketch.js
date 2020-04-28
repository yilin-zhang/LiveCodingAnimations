class Spring {
    constructor(M, K, D){
        this.pos = 0;
        this.vel = 0;
        this.acc = 0;
        this.f = 0;

        this.M = M; // Mass
        this.K = K; // Spring constant
        this.D = D;// Damping
        //this.R = 0; // Rest position
    }

    update() {
        this.f = -this.K * this.pos; // f=-ky
        this.acc = this.f / this.M;          // Set the acceleration, f=ma == a=f/m
        this.vel = this.D * (this.vel + this.acc);  // Set the velocity
        this.pos = this.pos + this.vel;        // Updated position

        if (abs(this.vel) < 0.1) {
            this.vel = 0.0;
        }
    }

    pull(distance) {
        this.pos += distance;
    }
}

class PString {
    constructor(length, color, thickness, M, K, D) {
        this.length = length;
        this.color = color;
        this.thickness = thickness;
        this.array = Array(this.length/2);
        for (let i=0; i < this.array.length; i++) {
            this.array[i] = new Spring(M, K, D);
        }
    }

    pull(distance) {
        let middle_pos = this.array.length / 2;
        for (let i=0; i < this.array.length; i++) {
            this.array[i].pull(Math.sin(Math.PI/2*(1 + (i - middle_pos)/middle_pos))*distance);
        }
    }

    draw(x, y) {
        for (let i=0; i < this.array.length; i++) {
            stroke(this.color); // Change the color
            strokeWeight(this.thickness);
            point(x+i*2, y+this.array[i].pos);
        }
    }

    update() {
        for (let i=0; i < this.array.length; i++) {
            this.array[i].update();
        }
    }
}

//////////////////////////////////////////////////
// Instrument Definitions
class Guitar {
    constructor(width, height, color) {
        this.strings = new Array(6);
        this.length = width;
        this.height = height;
        this.color = color;
        this.distance = 0;

        this.strings[0] = new PString(this.length, this.color, 4.5, 0.4, 0.5, 0.85);
        this.strings[1] = new PString(this.length, this.color, 4, 0.35, 0.4, 0.83);
        this.strings[2] = new PString(this.length, this.color, 3.5, 0.2, 0.3, 0.8);
        this.strings[3] = new PString(this.length, this.color, 3, 0.15, 0.2, 0.77);
        this.strings[4] = new PString(this.length, this.color, 2.5, 0.1, 0.15, 0.75);
        this.strings[5] = new PString(this.length, this.color, 2, 0.05, 0.1, 0.73);

        this.dur = 0;
        this.durCounter = 0;
    }

    trigger(distance, dur) {
        this.distance = distance;
        this.dur = dur;
        this.durCounter = dur;
    }

    reset() {
        this.dur = 0;
        this.durCounter = 0;
        this.distance = 0;
    }

    updateStatus() {
        if (this.dur === 0)
            return;

        if (this.durCounter === 0){
            this.durCounter = this.dur;
            this.pull(this.distance);
        }
        this.durCounter--;
    }

    pull(distance) {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].pull(distance);
        }
    }

    draw(x, y) {
        rectMode(CORNER);
        this.updateStatus();
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].update();
        }
        let interval_distance = this.height / (5-1);
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].draw(x, y+interval_distance*i);
        }
    }
}

class Bass {
    constructor(width, height, color) {
        this.strings = new Array(4);
        this.length = width;
        this.height = height;
        this.color = color;
        this.strings[0] = new PString(this.length, this.color, 5.5, 0.4, 0.5, 0.85);
        this.strings[1] = new PString(this.length, this.color, 5, 0.35, 0.4, 0.83);
        this.strings[2] = new PString(this.length, this.color, 4.5, 0.2, 0.3, 0.8);
        this.strings[3] = new PString(this.length, this.color, 4, 0.15, 0.2, 0.77);

        this.dur = 0;
        this.durCounter = 0;
    }


    trigger(distance, dur) {
        this.distance = distance;
        this.dur = dur;
        this.durCounter = dur;
    }

    reset() {
        this.dur = 0;
        this.durCounter = 0;
        this.distance = 0;
    }

    updateStatus() {
        if (this.dur === 0)
            return;

        if (this.durCounter === 0){
            this.durCounter = this.dur;
            this.pull(this.distance);
        }
        this.durCounter--;
    }

    pull(distance) {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].pull(distance);
        }
    }

    draw(x, y) {
        rectMode(CORNER);
        this.updateStatus();
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].update();
        }
        let interval_distance = this.height / (4-1);
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].draw(x, y+interval_distance*i);
        }
    }
}

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

    draw() {
        rectMode(CENTER);
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
            noStroke();
            fill(this.color);

            // fill(hueValue, 255, 255, alphaValue);

            rect(x, this.height/2, w, h);
            rect(this.width - x, this.height/2, w, h);
        }
    }
}

class Keyboard {
    constructor(width, height, whitekeycolor, blackkeycolor, triggeredkeycolor) {
        this.width = width;
        this.height = height;
        this.whitekeycolor = whitekeycolor;
        this.blackkeycolor = blackkeycolor;
        this.triggeredkeycolor = triggeredkeycolor;
        this.whiteWidth = this.width / 7;
        this.blackWidth = this.whiteWidth * 0.7;
        this.blackHeight = this.height * 0.7;
        this.triggeredSustain = 10;

        this.status = new Array(12);
        for (let i=0; i<12; i++) {
            this.status[i] = false;
        }

        this.durCounter = new Array(12);
        for (let i=0; i<12; i++) {
            this.durCounter[i] = 0;
        }

        this.dur = new Array(12);
        for (let i=0; i<12; i++) {
            this.durCounter[i] = 0;
        }
    }

    trigger(keyNum, dur) {
        this.status[keyNum] = true;
        this.dur[keyNum] = dur; // the period
        this.durCounter[keyNum] = dur; // the period
    }

    relase(keyNum) {
        this.status[keyNum] = false;
    }

    reset() {
        for (let i=0; i<12; i++) {
            this.status[i] = false;
        }

        for (let i=0; i<12; i++) {
            this.durCounter[i] = 0;
        }

        for (let i=0; i<12; i++) {
            this.dur[i] = 0;
        }
    }

    updateStatus(keyNum) {
        if (this.dur[keyNum] <= this.triggeredSustain || this.dur[keyNum] === 0)
            return;

        if (this.dur[keyNum] - this.durCounter[keyNum] >= this.triggeredSustain) {
            this.status[keyNum] = false;
            if (this.durCounter[keyNum] === 0){
                this.status[keyNum] = true;
                this.durCounter[keyNum] = this.dur[keyNum];
            }
        }
        this.durCounter[keyNum]--;
    }

    draw(x, y) {
        // draw whitekeys
        rectMode(CORNER);
        noStroke();
        let blackKeyNum = [1, 3, 6, 8, 10];
        let whiteKeyNum = [0, 2, 4, 5, 7, 9, 11];
        let num;
        for (let i=0; i<whiteKeyNum.length; i++){
            num = whiteKeyNum[i];
            // status
            if (this.status[num]){
                fill(this.triggeredkeycolor);
            } else {
                fill(this.whitekeycolor);
            }
            this.updateStatus(num);
            // draw
            if (num <= 4) {
                rect(x+num/2*this.whiteWidth, y, this.whiteWidth, this.height);
            } else {
                rect(x+(num+1)/2*this.whiteWidth, y, this.whiteWidth, this.height);
            }
        }
        for (let i=0; i<blackKeyNum.length; i++){
            num = blackKeyNum[i];
            // status
            if (this.status[num]){ // 1, 3, 6, 8, 10
                fill(this.triggeredkeycolor);
            } else {
                fill(this.blackkeycolor);
            }
            this.updateStatus(num);
            // draw
            if (num <= 3) {
                rect(x+(num+1)/2*this.whiteWidth-this.blackWidth/2, y, this.blackWidth, this.blackHeight);
            } else {
                rect(x+(num+2)/2*this.whiteWidth-this.blackWidth/2, y, this.blackWidth, this.blackHeight);
            }

        }
    }
}


//////////////////////////////////////////////////
// p5 set up

let waveform;
let guitar;
let bass;
let keyboard;

let guitar_dur = 0;
let bass_dur = 0;
let keyboard_dur = 0;

function setup() {
    c = createCanvas(windowWidth, windowHeight);
    noStroke();
    rectMode(CORNER);

    let waveform_color = '#cc00cc';
    let bass_color = '#0000cc';
    let guitar_color = '#9900cc';
    let keyboard_white_color = '#6600cc';
    let keyboard_black_color = '#3300cc';
    let keyboard_triggered_color = '#cc00cc';
    waveform = new Waveform(windowWidth, 200, waveform_color);
    mic = new p5.AudioIn();
    mic.start();
    waveform.initialize(mic);

    bass = new Bass(windowWidth, 80, bass_color);
    guitar = new Guitar(windowWidth, 100, guitar_color);
    keyboard = new Keyboard(windowWidth, 500, keyboard_white_color, keyboard_black_color, keyboard_triggered_color);

    guitar.pull(100);
    bass.pull(100);

}

function draw() {
    background(30);

    keyboard.draw(0, 170);
    waveform.draw();
    guitar.draw(0, 200);
    bass.draw(0, 550);
}


//////////////////////////////////////////////////
// OSC set up
let socket = io('http://127.0.0.1:8081');
socket.on('connect', function() {
    // sends to socket.io server the host/port of oscServer
    // and oscClient
    socket.emit('config',
                {
                    server: {
                        port: 3333,
                        host: '127.0.0.1'
                    },
                    client: {
                        port: 3334,
                        host: '127.0.0.1'
                    }
                }
               );
});

socket.on('message', function(obj) {
    let status = document.getElementById("status");
    status.innerHTML = obj[0];

    let info = JSON.parse(obj[1]);
    console.log(info);
    let attributes = info.attributes;
    let player = info.type;

    if (player === 'pluck')
    {
        guitar.reset();
        attributes.forEach((a) => {
            if (a.hasOwnProperty('amp'))
            {
                let amp = a.amp;
                if (Array.isArray(amp)) {
                    const total = amp.reduce((acc, c) => acc + c, 0);
                    guitar.trigger(total / amp.length * 80, 20);
                }
                else
                    guitar.pull(amp * 80, 20);
            }
        });
    }

    if (player === 'bass')
    {
        attributes.forEach((a) => {
            if (a.hasOwnProperty('amp'))
            {
                let amp = a.amp;
                if (Array.isArray(amp)) {
                    const total = amp.reduce((acc, c) => acc + c, 0);
                    bass.trigger(total / amp.length * 80, 20);
                }
                else
                    bass.trigger(amp * 80, 20);
            }
        });
    }

    if (player === 'pads'){
        keyboard.reset();
        attributes.forEach((a) => {
            if (a.hasOwnProperty('degree'))
            {
                let pitches = a.degree;
                if (Array.isArray(pitches)) {
                    pitches.forEach((p) => {
                        keyboard.trigger(p, 20);
                    });
                }
                else {
                    keyboard.trigger(pitches, 20);
                }
            }
        });
    }
});
