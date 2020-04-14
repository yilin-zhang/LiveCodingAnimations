const OSC = require('osc-js');

const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() });

osc.on('/test/random', message => {
    console.log(message.args)
  })


osc.open({ port: 8080 });