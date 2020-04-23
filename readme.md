# Live Coding Animation

String plucking animation.

## Set-up

### Install dependencies
```sh
$ npm install
```

### Set up the OSC sender
```sh
$ node osc_send_bridge.js
```
Open `osc_sender.html`.

You can also use any other OSC sender. The sending port should be 3333.

This part will be replaced by our FoxDot OSC sender.

### Set up OSC receiver

Install dependencies for `osc-web`, and run its bridge.
```sh
$ cd osc-web
$ node install
$ node bridge.js
```

(Optional, you can use other server if you have alternative like `SimpleHTTPServer` for Python.)
```sh
$ npm install http-server -g
```

Go back to the top level directory, run the http server, open `index.html`
```sh
$ http-server ./ -p 500
```

Go to [http://127.0.0.1:500/](http://127.0.0.1:500/), you'll see the animation canvas.

### Send OSC message

Click the `Send Message` button, the animation will be triggered.



