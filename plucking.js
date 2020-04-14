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

    draw() {
        fill(0.2);
        circle(50, this.pos, 10);
    }
}

class PString {
    constructor(length, M, K, D) {
        this.length = length;
        this.array = Array(this.length);
        for (let i=0; i < this.length; i++) {
            this.array[i] = new Spring(M, K, D);
        }
    }

    pull(distance) {
        let middle_pos = this.length / 2;
        for (let i=0; i < this.length; i++) {
            this.array[i].pull(Math.sin(Math.PI/2*(1 + (i - middle_pos)/middle_pos))*distance);
        }
    }

    draw(x, y) {
        for (let i=0; i < this.length; i++) {
            stroke('purple'); // Change the color
            strokeWeight(3);
            point(x+i*1, y+this.array[i].pos);
        }
    }

    update() {
        for (let i=0; i < this.length; i++) {
            this.array[i].update();
        }
    }
}

const string_len = 400;

// Mass, String constant, Damping
let thin_string = new PString(string_len, 0.1, 0.2, 0.8);
let mid_string = new PString(string_len, 0.2, 0.2, 0.85);
let bass_string = new PString(string_len, 0.3, 0.2, 0.9);

let counter = 0;

function setup () {
    createCanvas(710, 400);
    rectMode(CORNERS);
    noStroke();
    left = width / 2 - 100;
    right = width / 2 + 100;

    thin_string.pull(100);
    bass_string.pull(100);
    mid_string.pull(100);
}

function draw() {
    background(0);

    thin_string.update();
    thin_string.draw(150, 200);

    mid_string.update();
    mid_string.draw(150, 250);

    bass_string.update();
    bass_string.draw(150, 300);
    counter++;
    if (counter == 100){
        counter = 0;
        thin_string.pull(100);
        mid_string.pull(100);
        bass_string.pull(100);
    }
}

