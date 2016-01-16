var http = require('http');
var g = require("./lib/game.js").game;
var p = require("./lib/pack.js").lib;
var Card=require("./lib/card.js").lib.Card;

var Suits = Card.suits;

var c1 = new Card(Suits.diamonds,5);
var c2 = new Card(Suits.diamonds,6);
var c3 = new Card(Suits.diamonds,7);
var c4 = new Card(Suits.diamonds,8);
// var c5 = new Card(Suits.spades,5);
// var c6 = new Card(Suits.spades,6);
// var c7 = new Card(Suits.spades,7);
// var c8 = new Card(Suits.spades,8);

var cards = [c1,c2,c3,c4];
var suffler = function(cards){return cards}
var pack = p.packWith(cards, suffler);

// var pack = p.createPack();
var game=new g.Game(pack, p.emptyPack());

var server = http.createServer(function(req,res){
	console.log(req.url);
	var controller = require('./lib/controller')(game);
	return controller(req,res);
});
server.listen(4000);
console.log("server listening at port : 4000");
