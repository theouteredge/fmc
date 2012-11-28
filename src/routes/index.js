exports.index = function(req, res) {
  res.render('index', { layout: 'layout', title: 'Home' })
};

exports.room = function(req, res) {
  res.render('room', { layout: 'layout', title: 'Room' })
};

exports.create = function(req, res) {
  res.render('create', { layout: 'layout', title: 'Create Room' })
};

exports.invite = function(req, res) {
	res.render('invite', { layout: 'layout', title: 'Invite' })
}