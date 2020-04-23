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
    constructor(length, height, color) {
        this.strings = new Array(5);
        this.length = length;
        this.height = height;
        this.strings[0] = new PString(this.length, color, 4.5, 0.4, 0.5, 0.85);
        this.strings[1] = new PString(this.length, color, 4, 0.35, 0.4, 0.83);
        this.strings[2] = new PString(this.length, color, 3.5, 0.2, 0.3, 0.8);
        this.strings[3] = new PString(this.length, color, 3, 0.15, 0.2, 0.77);
        this.strings[4] = new PString(this.length, color, 2.5, 0.1, 0.15, 0.75);
        this.strings[5] = new PString(this.length, color, 2, 0.05, 0.1, 0.73);
    }

    pull(distance) {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].pull(distance);
        }
    }

    draw(x, y) {
        let interval_distance = this.height / (5-1);
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].draw(x, y+interval_distance*i);
        }
    }

    update() {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].update();
        }
    }
}

class Bass {
    constructor(length, height, color) {
        this.strings = new Array(4);
        this.length = length;
        this.height = height;
        this.strings[0] = new PString(this.length, color, 5.5, 0.4, 0.5, 0.85);
        this.strings[1] = new PString(this.length, color, 5, 0.35, 0.4, 0.83);
        this.strings[2] = new PString(this.length, color, 4.5, 0.2, 0.3, 0.8);
        this.strings[3] = new PString(this.length, color, 4, 0.15, 0.2, 0.77);
    }

    pull(distance) {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].pull(distance);
        }
    }

    draw(x, y) {
        let interval_distance = this.height / (4-1);
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].draw(x, y+interval_distance*i);
        }
    }

    update() {
        for (let i=0; i < this.strings.length; i++) {
            this.strings[i].update();
        }
    }
}

///////////////////////////////////////////////////
// Parameter configurations

const string_len = 400;

// length, height, color
let guitar = new Guitar(400, 100, 'green');
let bass = new Bass(400, 80, 'purple');

let counter = 0;

///////////////////////////////////////////////////
// JSON format
// p1>>pluck(degree=[4,5,6],amp=[2,2,2,2],sample=1)
let json_pak = { p1:
                 { type: 'pluck',
                   attributes: [
                       {degree: [4, 5, 6]},
                       {amp: [2, 2, 2, 2]},
                       {sample: 1}]}};

///////////////////////////////////////////////////
// p5 set up

function setup () {
    createCanvas(710, 400);
    rectMode(CORNERS);
    noStroke();
    left = width / 2 - 100;
    right = width / 2 + 100;

    guitar.pull(100);
    bass.pull(100);

}

function draw() {
    background(0);

    guitar.update();
    guitar.draw(150, 80);

    bass.update();
    bass.draw(150, 250);

    //counter++;
    //if (counter == 100){
    //    counter = 0;
    //    guitar.pull(30);
    //    bass.pull(30);
    //}
}

//////////////////////////////////////////////////
// osc set up

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
