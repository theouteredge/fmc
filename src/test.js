var RoomService = require('./services/roomService.js');

console.log('creating the room service...');
var service = new RoomService();


console.log('creating a room');
var result = service.create('dbg ltd', 'andy', true);

if (result) {
  console.log('room has apparently been created... trying to find it again');
  var room = service.find('dbg ltd');


  console.log('did we find the room? we here it a dump:')
  console.log(room);


  console.log('attempting to join the dbg ltd room');
  result = service.join('dbg ltd', null, 'theouteredge', 'andy@theouteredge.co.uk');

  console.log('did we join the room? %s', result ? 'YES' : 'NO');

  var room = service.find('dbg ltd');


  console.log('so the room now looks like:')
  console.log(room);


  console.log('trying to create a duplicate room');
  console.log('creating a room');
  result = service.create('dbg ltd', 'andy', true);

  if (result) console.log('we created a duplicate room O_o');
  else console.log('we couldnt create a duplicate room :)');


  console.log('trying to add two people to the room');

  result = service.join('dbg ltd', null, 'theouteredge', 'andy@theouteredge.co.uk');
  
  if (result) console.log('we created a duplicate user O_o');
  else console.log('we couldnt create a duplicate user :)');
}
else console.log('we couldn\'t create the room');


console.log('finished')