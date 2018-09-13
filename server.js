var http = require('http');
var Games = require("./lib/games.js");
var handler = require('./lib/controller');

var games=new Games();

var PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 4000;
var IP = process.env.OPENSHIFT_NODEJS_IP;

var server = http.createServer(function(req,res){
	var controller = handler(games);
	return controller(req,res);
});

server.listen(PORT, IP);
