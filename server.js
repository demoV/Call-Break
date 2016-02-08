var http = require('http');
var Games = require("./lib/games.js");
var handler = require('./lib/controller');
var games=new Games();
var port = 4000;
var server = http.createServer(function(req,res){
	var controller = handler(games);
	return controller(req,res);
});
server.listen(port);
console.log("server listening at port : ", port);
