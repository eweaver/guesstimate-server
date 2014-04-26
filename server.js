var express = require("express"),
    logfmt = require("logfmt"),
    app = express(),
    config = require('./etc/config');

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    res.send('Hello World!');
});

var port = Number(config.server.port);
app.listen(port, function() {
    console.log("Listening on " + port);
});