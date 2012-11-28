require('../common.js').init();

var Room = function (name, owner, open) {
	this._name = name;
	this._owner = owner;
	this._open = open;
	this._users = [];
};

Room.prototype = {
	name: function(value) {
		if (value) {
			this._name = value;
		}
		else {
			return this._name;
		}
	},

	owner: function (value) {
		if (value) {
			this._owner = value;
		}
		else {
			return this._owner;
		}
	},

	open: function (value) {
		if (value === undefined) return this._open;
		else this._open = value;
	},

	users: function(value) {
		if (value) {
			this._users = value;
		}
		else {
			return this._users;
		}
	},

	addUser: function (user) {
		console.log("%s is trying to join room %s", user.handle(), this._name);

    	if (this._users.contains(function (x) { return x.handle() === user.handle(); })) {
       		console.log("room already contains this user %s, updating their details", user.handle());
       		
       		var existing = this._users.first(function (x) { return x.handle() === user.handle(); });
       		existing.socket(user.socket());
       		existing.email(user.email());

       		return true;
       	}
       	else  this._users.push(user);
    	return true;
	},

	send: function(type, message) {
		for(var i=0; i < this._users.length; i++) {
			this._users[i].send(type, message);
		}
	},

	isOwner: function(handle) {
		var user = this._users.first(function (x) { return x.handle() === handle; });
		return user.isOwner();
	},

	start: function() {
		var dj = this._users.first(function (x) { return x.isDJ(); });
		if (dj) {
			this.notifyDJ(dj);
		}
		else {
			this._users[0].isDJ(true);
			this.notifyDJ(this._users[0]);
		}

		this._interval = setInterval(function (room) { room.pickDJ() }, 300000, this);
	},

	pickDJ: function() {
		console.log('pciking DJ for room %s', this.name());

		var nextDJIndex = -1;
		var djIndex = this._users.find(function(x) { return x.isDJ(); });

		if (djIndex === null) {
			nextDJIndex = 0;
		}
		else {
			// would the next DJ index be outside of the bounds of the array?
			if ((djIndex + 1) < this._users.length) {
				nextDJIndex = djIndex+1;
			}
			else {
				nextDJIndex = 0;
			}
			this._users[djIndex].isDJ(false);
		}

		this.notifyDJ(this._users[nextDJIndex]);
	},

	notifyDJ: function(dj) {
		dj.isDJ(true);
		dj.send('getsong');

		this.send('announcement', { handle: dj.handle(), message: 'is your DJ' });
	},

	emptyPlaylist: function() {
		var dj = this._users.first(function (x) { return x.isDJ(); });
		this.send('announcement', { handle: dj.handle(), message: 'doesn\'t have any songs in their playlist O_o picking another DJ' });

		this.pickDJ();
	},

	nextSong: function (song) {
		if (song) {
			for(i = 0; i < this._users.length; i++) {
				this._users[i].send('play', { Url: song.Url, SongName: song.SongName, ArtistName: song.ArtistName, AlbumName: song.AlbumName });
			}
		}
		else {
			var dj = this._users.first(function (x) { return x.isDJ(); });
			this.send('announcement', { handle: dj.handle(), message: 'sent us an empty song, what a disapointment! O_o' });
			this.pickDJ();
		}
	}
};


module.exports = Room;