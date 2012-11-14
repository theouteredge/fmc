
// Module dependencies.

var express = require('express');
var routes = require('./routes');

app = module.exports = express();

console.log("Configuring express");

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'super secret session secret' }));
});

app.set('view options', { layout: false })

console.log("Configuring express development");
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

console.log("Configuring production");
app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
console.log("Configuring routes");
app.get('/', routes.index);
app.get('/room/:name', routes.room);
app.get('/room/create', routes.create);
app.get('/room/invite', routes.invite);

console.log("starting express");
app.listen(process.env.port || 3000);

// app.address().port doesn't
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
