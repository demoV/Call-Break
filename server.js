var http = require('http');
var controller = require('./lib/controller.js');
var g = require("./lib/game.js").game;
var p = require("./lib/pack.js").lib;


var Card=require("./lib/card.js").lib.Card;
var Suits = Card.suits;

var c1 = new Card(Suits.diamonds,5);
var c2 = new Card(Suits.diamonds,6);
var c3 = new Card(Suits.diamonds,7);
var c4 = new Card(Suits.diamonds,8);
var c6 = new Card(Suits.spades,5);
var c7 = new Card(Suits.spades,6);
var c8 = new Card(Suits.spades,7);
var c9 = new Card(Suits.spades,8);

var cards = [c1,c2,c3,c4];
var suffler = function(cards){return cards}
var pack = p.packWith(cards, suffler);
var game=new g.Game(pack, p.emptyPack());


var requestHandler = controller(game);

var server = http.createServer(requestHandler);
server.listen(4000);

