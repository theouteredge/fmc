var Room = require('./models/Room');
var User = require('./models/User');

var room = new Room('dbg ltd', 'andy', false);

console.log('create a new room %s %s %s\n', room.name(), room.owner(), room.open());

var andy = new User(null, 'andy', 'andy@theouteredge.co.uk', true);
console.log('created andy %s %s %s %s\n', andy.handle(), andy.email(), andy.isOwner(), andy.isDJ());

var theouteredge = new User(null, 'theouteredge', 'andy@theouteredge.co.uk', false)
console.log('created theouteredge %s %s %s %s\n', theouteredge.handle(), theouteredge.email(), theouteredge.isOwner(), theouteredge.isDJ());

var tonimarie = new User(null, 'tonimarie', 'tonimevens@hotmail.co.uk', false)
console.log('created tonimarie %s %s %s %s\n', tonimarie.handle(), tonimarie.email(), tonimarie.isOwner(), tonimarie.isDJ());


room.addUser(andy);
console.log('added andy to the room')
console.log(room.users());


room.addUser(theouteredge);
console.log('added theouteredge to the room')
console.log(room.users());

room.addUser(tonimarie);
console.log('added tonimarie to the room')
console.log(room.users());


console.log('\npicking a DJ [should be 0]');
room.pickDJ();
console.log(room.users());

console.log('\npicking the next DJ [should be 1]');
room.pickDJ();
console.log(room.users());


console.log('\npicking the next DJ [should be 2]');
room.pickDJ();
console.log(room.users());

console.log('\npicking the next DJ [should be 0]');
room.pickDJ();
console.log(room.users());


console.log('FINISHED');

