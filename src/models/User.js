var User = function (socket, handle, email, isOwner) {
	this._socket = socket;
	this._handle = handle;
	this._email = email;
	this._owner = isOwner;
	this._dj = false;
};

User.prototype = {
	socket: function (value) {
		if (value) this._socket = value;
		else return this._socket;
	},

	handle: function (value) {
		if (value) this._handle = value;
		else return this._handle;
	},

	email: function (value) {
		if (value) this._email = value;
		else return this._email;
	},

	isOwner: function (value) {
		if (value === undefined) return this._owner;
		else this._owner = value;
	},

	isDJ: function (value) {
		if (value === undefined) return this._dj;
		else this._dj = value;
	},

	send: function(type, message) {
		if (this._socket)
			this._socket.emit(type, message);
		else 
			console.log('sending [%s] [%s] to %s', type, message, this._handle);
	}
};

module.exports = User;