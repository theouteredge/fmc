
require('./common').init();

// Module dependencies.
var express = require('express');
var RoomService = require('./services/roomService');
var service = new RoomService();

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , routes = require('./routes');

console.log("Configuring express");

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'super secret session secret' }));
});

console.log("Configuring express development");
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

console.log("Configuring production");
app.configure('production', function () {
    app.use(express.errorHandler());
});


// Routes
console.log("Configuring routes");
app.get('/', routes.index);
app.get('/room/:name', routes.room);
app.get('/room/create', routes.create);
app.get('/room/invite', routes.invite);


console.log("starting express");
server.listen(process.env.port || 3000);

// app.address().port doesn't
console.log("Express server listening on port %d in %s mode", process.env.port || 3000, app.settings.env);
console.log("Configuring socket.io");

var sockets = [];

io.sockets.on('connection', function (socket) {
    socket.on('login', function (data) { service.connect(data, socket); });

    socket.on('list', function (data) { service.list(socket); });

    socket.on('create', function (data) {
        if (service.create(data.name, data.handle, data.open)) {
            console.log('%s create the room: %s', data.handle, data.name);

            if (service.join(data.name, socket, data.handle, data.email, true)) {
                service.broadcast(data.name, 'announcement', data.handle, 'has joined the room');
                socket.emit('joined', { room: data.name, isOwner: true });
            }
            else {
                socket.emit('alert', { message: 'Room created, but we where unable to connect you to the room' });
                console.log('%s created a room but was unable to join it...', data.handle);
            }
        }
        else {
            socket.emit('alert', { message: 'A room with the name ' + data.name + ' already exists' });
            console.log('%s already exists', data.room);
        }
    });

    socket.on('tryJoin', function (data) {
        console.log('%s is trying to join the room %s', data.handle, data.room);

        if (service.join(data.room, socket, data.handle, data.email, false)) {
            console.log('%s join the room %s', data.handle, data.room);
            service.broadcast(data.room, 'announcement', data.handle, 'has joined the room');
            socket.emit('joined', { room: data.room, isOwner: service.isOwner(data.handle, data.room) });
        }
        else {
            console.log("%s was unable to join the room %s", data.handle, data.room);
            socket.emit('alert', { message: 'joining room ' + data.room + 'failed, please try again later' });
        }
    });

    socket.on('chat', function (data) {
        console.log("chat message broadcats to a room: %s", data.room);
        service.broadcast(data.room, 'chat', data.handle, data.message);
    });

    socket.on('search', function (data) {
        console.log('searching for %s', data.query);
        service.search(data, socket);
    });

    socket.on('start', function(data) {
        service.start(data.room);
    });

    socket.on('emptyPlaylist', function(data) {
        service.emptyPlaylist(data.room);
    });

    socket.on('nextSong', function(data) {
        console.log('the next song for %s has been picked and its', data.room);
        console.log(data.song);

        service.nextSong(data.room, data.song);
    });
});
