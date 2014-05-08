var fs = require('fs');
var server = require('http').createServer();
var io = require('socket.io').listen(server);

io.set('log level', 1);
count = 0;

server.on('request', function(req, res) {
	fs.readFile('client.html', function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('エラーが発生しました');
		}
		res.writeHead(200, {
			'Conent-Type': 'text/html; charset=utf-8'
		});
		res.end(data);
		fs.readFile('style.css', function (err, data) {
			res.writeHead(200, {
				'Conent-Type': 'text/css;'
			});
		});
	});
});
server.listen(process.env.PORT || 1337);

io.sockets.on('connection', function (socket) {
	socket.emit('serverReady', function (response) {
		console.log(response + ' ID = ' + socket.id);
	});

	socket.on('clicked', function (data) {
		count+=0.5;
		console.log('個人'+data+', 全体'+count);

		// クリックした本人にのみ全体の回数を送信
		socket.emit('totalChanged', count, function (data) {
			console.log(data);
		});

		// それ以外のクライアントに全体の回数を送信
		socket.broadcast.emit('totalChanged', count, function (data) {
			console.log(data);
		});
	});

});