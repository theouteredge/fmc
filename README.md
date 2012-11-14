friday music club
===

Friday Music Club is a social music listening website written to learn nodejs, express, socket.io and redis


about
---

Allow users to create a music club so they can share a play list and listen to music together on Fridays. They will be able to invite people via email to a room (v2 twitter/facebook).
On Friday usres will be able join a room and start building their playlist but selecting songs from http://tinysong.com/ API

When the room starts the system will choose a DJ and the first song from their play lists will be sent to each user and will start playing. That song will then be removed from their playlist

Once the song finishes playing for the DJ their page will notify the system and a new DJ will be selected and we will start the process again.

The page should also have a chat option, so people not in the same location and slag off someones music choice O_o


basic use cases
---

__create a room__
A user should be able to create a new room on the site, they will then become the admin of that room. The user will have to specify their email address and should be able to name the room and set whether its a public or private room.

__invite people to a room__
From within a room users will be able to invite people to join the room by sending out emails to people containing a link to the room. This will allow a user to join a room. If the room is private, only the administrator will be able to invite people to join their room.

__join a room__
After following a link to a room, the user will have to supply there email address and set their name, they will then be signed into the room.
If the room is private only users who have been invited to the room via an admin inviation will be allowed to join (email must match an email on the invitaion list).

__create a play list__
After accessing a room a user will be able to search for songs and add selected songs to a play list, this will be stored in memory, if the user leave the room the play list will be lost.
Use the http://tinysong.com/ API to search for songs

__start a room__
A room administrator will be able to start a room. This will kick off the music playing. The system will start a pick-dj > get-song > play song loop. After each song finishes a new song dj and song is selected. If a user does not have a any songs in their playlist a new dj will be selected, but the user will be notified that then need to pick more songs.

  pick a dj
    select the next person in the list
    notify everyone of the current dj
  get-song
    send a message to the dj to get their next song
    send everyone the next song
  play-song
  	everyone starts playing the selected song from http://tinysong.com/
  	once the songs stops for the dj send complete message
  goto 40

__send a message__
From within a room users will be able to send messages to each other. If a user submites a message it will be broadcast to all users within the room.