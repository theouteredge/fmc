exports.index = function(req, res) {
  res.render('index', { title: 'Home' })
};

exports.room = function(req, res) {
  res.render('room', { title: 'Room' })
};

exports.create = function(req, res) {
  res.render('create', { title: 'Create Room' })
};

exports.invite = function(req, res) {
	res.render('invite', {title: 'Invite'})
}