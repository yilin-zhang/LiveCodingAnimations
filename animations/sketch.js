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
        this.strings = new Array(5);
        this.length = width;
        this.height = height;
        this.color = color;
        this.strings[0] = new PString(this.length, this.color, 4.5, 0.4, 0.5, 0.85);
        this.strings[1] = new PString(this.length, this.color, 4, 0.35, 0.4, 0.83);
        this.strings[2] = new PString(this.length, this.color, 3.5, 0.2, 0.3, 0.8);
        this.strings[3] = new PString(this.length, this.color, 3, 0.15, 0.2, 0.77);
        this.strings[4] = new PString(this.length, this.color, 2.5, 0.1, 0.15, 0.75);
        this.strings[5] = new PString(this.length, this.color, 2, 0.05, 0.1, 0.73);
    }

    pull(distance) {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].pull(distance);
        }
    }

    draw(x, y) {
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
    }

    pull(distance) {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].pull(distance);
        }
    }

    draw(x, y) {
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
        console.log(this.color);

        this.prevLevels = new Array(60);
    }

    initialize(mic) {
        this.amplitude = new p5.Amplitude();
        this.amplitude.setInput(mic);
        this.amplitude.smooth(0.6);
    }

    draw() {
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

let waveform;
let guitar;
let bass;

function setup() {
    c = createCanvas(windowWidth, windowHeight);
    background(0);
    noStroke();
    rectMode(CENTER);
    // colorMode(HSB);

    waveform = new Waveform(800, 200, 'purple');
    mic = new p5.AudioIn();
    mic.start();
    waveform.initialize(mic);

    bass = new Bass(400, 80, 'blue');
    guitar = new Guitar(400, 100, 'green');

    guitar.pull(100);
    bass.pull(100);

}

function draw() {
    background(20, 20);

    waveform.draw();

    guitar.draw(150, 150);

    bass.draw(150, 350);
}


var socket = io('http://127.0.0.1:8081');
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
    var status = document.getElementById("status");
    guitar.pull(30);
    bass.pull(30);
    status.innerHTML = obj[0];
    console.log(obj);
});
