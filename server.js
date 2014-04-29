var express = require("express"),
    logfmt = require("logfmt"),
    app = express(),
    config = require('./etc/config'),
    Router = require('./lib/Router'),
    router = new Router(require('./etc/routes'), config.app);

app.use(logfmt.requestLogger());
app = router.setRoutes(app);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
