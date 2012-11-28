require('../common.js').init();
var superagent = require('superagent'); 


Room = require('../models/Room.js');
User = require('../models/User.js');

var RoomService = function() {
    this._rooms = [];
    this._sockets = [];
    this._superagent = superagent;
    this._apiKey = encodeURIComponent('a80917320ed9097e51450594f3131e81');
};

RoomService.prototype.create = function (name, owner, open) {
    if (this._rooms === undefined)
        this._rooms = [];

    console.log("%s is trying to create a %s room %s", owner, open ? 'open' : 'closed', name);

    if (this._rooms.contains(function (x) { return x.name() === name; }))
        return false;

    console.log('the room doesn\'t already exist so creating a new one');
    var room = new Room(name, owner, open);

    console.log('created room: [name:%s, open:%s, owner:%s]', room.name(), room.open(), room.owner());

    this._rooms.push(room);

    console.log('room added to the rooms array');
    console.log(this._rooms);

    return true;
};

RoomService.prototype.isOwner = function (handle, room) {
    var room = this._rooms.first(function (x) { return x.name() === room; });   
    if (room) {
        return room.isOwner(handle);
    }

    return false;
};

RoomService.prototype.find = function (name) {
    return this._rooms.first(function (x) { return x.name() === name; });
};

RoomService.prototype.join = function (roomName, socket, handle, email, isOwner) {
    console.log("%s is trying to join the room %s", handle, roomName);
    console.log(this._rooms);

    if (!this._rooms.contains(function (x) { return x.name() === roomName; })) {
        console.log("the %s room doesnt exist", roomName);
        return false;
    }

    console.log("room %s exists", roomName);
    var room = this._rooms.first(function (x) { return x.name() === roomName; });
    var user = new User(socket, handle, email, isOwner);

    console.log("adding the user to the %s room", roomName);
    return room.addUser(user);
}

RoomService.prototype.broadcast = function (name, type, handle, msg) {
    console.log("sending a message [%s] from [%s] to the room [%s] %s", type, handle, name, msg);

    var room = this._rooms.first(function (x) { return x.name() === name; });
    if (room) {
        room.send(type, { handle: handle, message: msg });
    }
}; 

RoomService.prototype.list = function (socket) {
    if (this._rooms) {
        var roomList = this._rooms.map(function (room) { 
            return { name: room.name(), public: room.open(), users: room.users() === undefined ? 0 : room.users().length };
        });
        socket.emit('list', { rooms: roomList });
    }
    else socket.emit('list', { rooms: undefined });
    
};

RoomService.prototype.connect = function (data, socket) {
    console.log('checking if the new connection is reconnecting');

    var existing = this._sockets.first(function (x) { return x.handle === data.handle; });
    if (existing) {
        existing.socket = socket;

        var room = this._rooms.first(function (x) { return x.users().contains(function(y) { return y.handle() === existing.handle; }); });
        if (room) {
            var user = room.users().first(function (x) { return x.handle() === existing.handle; });
            user.socket(socket);

            socket.emit('reconnect', { handle: existing.handle, email: existing.email, room: room ? room.name() : null });
        }
        else {
            this._sockets.push({ socket: socket, handle: data.handle, email: data.email });
            socket.emit('connected', { handle: data.handle, email: data.email });    
        }
    }
    else {
        this._sockets.push({ socket: socket, handle: data.handle, email: data.email });
        socket.emit('connected', { handle: data.handle, email: data.email });
    }
};

RoomService.prototype.search = function (data, socket) {
    console.log('about to try supperagent');
    this._superagent('http://tinysong.com/s/' + encodeURIComponent(data.query) + '?key=' + this._apiKey + '&format=json', function (result) {
        if (result.status === 200) {
            console.log('search status is 200');
            socket.emit('results', { result: 'OK', songs: JSON.parse(result.text) });
        }
        else {
            console.log('search status is %s', result.status);
            socket.emit('results', { result: 'ERROR', message: 'tinysong.com returned an http code: ' + result.status });
        }
    }).on('error', function (ex) {
        console.log('superagent exception caught %s', ex.message);
        socket.emit('results', { result: 'ERROR', message: 'We where unable to contact tinysong.com: ' + ex.message });       
    });
};

RoomService.prototype.emptyPlaylist = function (room) {
    var room = this._rooms.first(function(x) { return x.name() === room; })
    room.emptyPlaylist();
};

RoomService.prototype.nextSong = function (room, song) {
    var room = this._rooms.first(function(x) { return x.name() === room; })
    room.nextSong(song);
};

RoomService.prototype.start = function(room) {
    var room = this._rooms.first(function(x) { return x.name() === room; })
    if (room) {
        room.start();
        console.log('started room %s very exciting!', room);
    }
    else console.log('unable to start room %s as it doesnt exist',  data.room);
};


module.exports = RoomService;