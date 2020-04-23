# Live Coding Animation

String plucking animation.

## Set-up

1. Install dependencies
```sh
$ npm install
```

2. Run OSC sender
```sh
$ node osc_send_bridge.js
```
Open osc_sender.html

3. Set up OSC receiver

Install dependencies for `osc-web`, and run its bridge.
```sh
$ cd osc-web
$ node install
$ node bridge.js
```

(Optional, if you have alternative like `SimpleHTTPServer` for Python.)
```sh
$ npm install http-server -g
```

Go back to the top level directory, run the http server, open `index.html`
```sh
$ http-server ./ -p 500
```

Go to [http://127.0.0.1:500/](http://127.0.0.1:500/), you'll see the animation canvas.

4. Send OSC

Click the `Send Message` button, the animation will be triggered.



