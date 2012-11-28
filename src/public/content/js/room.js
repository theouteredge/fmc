var socket = null;
var handle = null;
var email = null;
var room = null;

var roomInterval = null;
var playlist = [];
var searchResults = [];


$(document).ready(function () {
    $("#room").hide();
    $("#rooms").hide();

    $("#connect-form-submit").click(function () {
        socket = io.connect();
        handleSocketEvents();

        handle = $("#connect-form-handle").val();
        email = $("#connect-form-email").val();

        $("#connect-form-submit").val("connecting...");
        $("#connect-form-submit").attr('disabled', 'disabled');

        socket.emit('login', { email: email, handle: handle });
        socket.emit('list');

        return false;
    });

    $("#rooms-refresh").click(function() {
        socket.emit('list');
    });

    $("#rooms-form-submit").click(function () {
        if (socket) {
            room = $("#rooms-form-name").val();
            socket.emit('create', { name: room, email: email, handle: handle, open: true });
        }
        else alert("Your not conntect to the server");

        return false;
    });

    $(".connect").live('click', function () {
        var roomName = $(this).attr("room-name");
        if (socket) {
            alert(roomName);
            socket.emit('tryJoin', { room: roomName, handle: handle, email: email });
        }
        else alert("Your not connected to the server");

        return false;
    });

    $("#chat-form-submit").click(function () {
        if (socket && room) {
            socket.emit('chat', { message: $("#chat-form-message").val(), handle: handle, room: room });
            $("#chat-form-message").val('');
        }
        else alert("Your not conntect to the server");

        return false;
    });

    $("#playlist-form-submit").click(function () {
        var query = $("#playlist-form-search").val();
        socket.emit('search', { query: query });

        $("#playlist-form-submit").val('searching...');
        $("#playlist-form-submit").attr('disabled', 'disabled');

        return false;
    });

    $('.preview').live('click', function (event) {
        event.preventDefault();

        $('#now-playing-iframe').attr('src', $(this).attr('href'));
        return false;
    });

    $('.playlist').live('click', function () {
        var index = parseInt($(this).attr('search-results-index'));

        if (index < searchResults.length) {
            playlist.push(searchResults[index]);
            
            renderSongList('#playlist-list', playlist, false);
        }

        return false;
    });

    $("#room-start").click(function () {
        socket.emit('start', { room: room });
        return false;
    });
});


function renderSongList(selector, songs, searchresults) {
    $(selector).html('');
    $.each(songs, function (i, result) {
        var songHtml = '<li><ul>';
        if (searchresults) {
            songHtml = songHtml + '<li><a href="' + result.Url + '" class="preview">preview</a></li>';
            songHtml = songHtml + '<li><a href="' + result.Url + '" search-results-index="'+ i +'" class="playlist">playlist</a></li>';
        }
        songHtml = songHtml + '<li>' + result.SongName + '</li>';
        songHtml = songHtml + '<li>' + result.ArtistName + '</li>';
        songHtml = songHtml + '<li>' + result.AlbumName + '</li>';
        songHtml = songHtml + '</ul></li>';

        $(selector).append(songHtml);
    });
};


function handleSocketEvents() {
    if (socket) {
        socket.on('alert', function (data) {
            alert(data.message);
        });


        socket.on('reconnect', function (data) {
            handle = data.handle;
            email = data.email;

            if (data.room)
                socket.emit('tryJoin', { room: data.room, handle: data.handle, email: email });
            else {

            }
        });


        socket.on('connected', function (data) {
            $("#connect").hide();
            $("#rooms").show();

            if (socket) {
                socket.emit('list');
            }
        });


        socket.on('list', function (data) {
            if (data.rooms === undefined || data.rooms.length === 0) {
                $("#rooms-list").html("<li>no rooms available</li>");
            }
            else {
                $("#rooms-list").html('');
                $.each(data.rooms, function(i, room) {
                    $("#rooms-list").append("<li>"+ room.name +" (users: " + room.users + ") <a href=\"#\" class='connect' room-name='" + room.name + "'>connect</a></li>");
                });
            }
        });


        socket.on('joined', function (data) {
            // do some shit based on a user joining a room
            room = data.room;
            if (data.isOwner) {
                $('#room-start').show();
            }
            else $('#room-start').hide();

            $("#chat-list").html("");

            $("#welcome").hide();
            $("#room").show();

            $("#room-title").html(data.room + '' + data.isOwner ? 'owner' : 'member');
        });


        socket.on('left', function (data) {
            // do some shit based on a user leaving a room
            room = null;

            $("#chat").html("");
            $("#welcome").show();
            $("#room").hide();
        });


        socket.on('kicked', function (data) {
            // do some shit based on a user being kicked from a room
            room = null;

            $("#chat").html("");
            $("#welcome").show();
            $("#room").hide();
        });


        socket.on('chat', function (data) {
            $("#chat").prepend('<li class="chat"><span>' + data.handle + '</span> ' + data.message + '</li>');
        });


        socket.on('announcement', function (data) {
           $("#chat").prepend('<li class="announcement"><span>' + data.handle + '</span> ' + data.message + '</li>');
        });


        socket.on('results', function (data) {
            $("#playlist-form-submit").removeAttr('disabled');
            $("#playlist-form-submit").val('search');
            
            if (data.result === 'OK') {
                searchResults = data.songs;
                renderSongList('#playlist-form-results', data.songs, true);
            }
            else alert(data.message);
        });


        socket.on('getsong', function () {
            if (playlist.length === 0) {
                socket.emit('emptyPlaylist', { room: room });
            }
            else {
                var song = playlist[0];
                playlist = playlist.slice(1);
                socket.emit('nextSong', { room: room, song: song });

                renderSongList('#playlist-list', playlist, false);
            }
        });

        socket.on('play', function (data) {
            // tinysong.com uses an window.onbeforeunload event to pop up a dialog to check if you want to leave the page. this fucks shit up
            // if you just try and change the src of the iframe as the message gets displayed in the main window. to get arround this we
            // remove the iframe element from the page which stops this message from being displayed and the recreate it. yeah!
            $('#playing-container').remove('#now-playing-iframe');
            $('#playing-container').html('<iframe id=\'now-playing-iframe\'></iframe>');
            $('#now-playing-iframe').attr('src', data.Url);


            $('#now-playing-url').html(data.Url);
            $('#now-playing-songname').html(data.SongName);
            $('#now-playing-artistname').html(data.ArtistName);
            $('#now-playing-albumname').html(data.AlbumName);
        });
    }
}