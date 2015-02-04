var express   = require('express');
var fs        = require('fs');
var io        = require('socket.io');
var _         = require('underscore');
var Mustache  = require('mustache');
var http      = require('http');

var app       = express();
var staticDir = express.static;
var server    = http.createServer(app);
io            = io.listen(server);

var opts = {
	port :      1947,
	baseDir :   __dirname + '/../../..'
};

io.sockets.on('connection', function(socket) {
	socket.on('slidechanged', function(slideData) {
		socket.broadcast.emit('slidedata', slideData);
	});
	socket.on('fragmentchanged', function(fragmentData) {
		socket.broadcast.emit('fragmentdata', fragmentData);
	});
    socket.on('next', function(nextData) {
		socket.broadcast.emit('next', nextData);
	});
    socket.on('prev', function(nextData) {
		socket.broadcast.emit('prev', nextData);
	});
    socket.on('next-slide', function(nextData) {
		socket.broadcast.emit('next-slide', nextData);
	});
    socket.on('prev-slide', function(nextData) {
		socket.broadcast.emit('prev-slide', nextData);
	});
});


[ 'lib', 'gfs2015' ].forEach(function(dir) {
	app.use('/' + dir, staticDir(opts.baseDir + '/' + dir));
});

app.get("/", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream(opts.baseDir + '/gfs2015.html').pipe(res);
});

app.get("/notes/:socketId", function(req, res) {

	fs.readFile(opts.baseDir + '/lib/reveal-plugins/notes-server/notes.html', function(err, data) {
		res.send(Mustache.to_html(data.toString(), {
			socketId : req.params.socketId
		}));
	});
	// fs.createReadStream(opts.baseDir + 'notes-server/notes.html').pipe(res);
});

// Actually listen
server.listen(opts.port || null);

var brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

var slidesLocation = "http://localhost" + ( opts.port ? ( ':' + opts.port ) : '' );

console.log( brown + "reveal.js - Speaker Notes" + reset );
console.log( "1. Open the slides at " + green + slidesLocation + reset );
console.log( "2. Click on the link your JS console to go to the notes page" );
console.log( "3. Advance through your slides and your notes will advance automatically" );
