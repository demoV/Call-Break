var http = require('http');
var controller = require('./lib/controller.js');
var g = require("./lib/game.js").game;
var p = require("./lib/pack.js").lib;
var game=new g.Game(p.createPack());

var requestHandler = controller(game);

var server = http.createServer(requestHandler);
server.listen(4000);

