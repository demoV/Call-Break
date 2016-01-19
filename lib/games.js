var _ = require('lodash')
var g = require('./game.js').game;
var p = require("../lib/pack.js").lib;


///////////////////////////////----SETUP FOR TESTING------//////////////////////

// var Card=require("../lib/card.js").lib.Card;
// var Suits = Card.suits;

// var c1 = new Card(Suits.diamonds,5);
// var c2 = new Card(Suits.diamonds,6);
// var c3 = new Card(Suits.diamonds,7);
// var c4 = new Card(Suits.diamonds,8);

// var cards = [c1,c2,c3,c4];
// var suffler = function(cards){return cards};	


///////////////////////////////////////////////////////////////////////////////

var Games = function() {
	this.games = [];
};

Games.prototype = {
	get count(){
		return this.games.length;
	},
	addPlayer : function(player){
		if(this.gameOf(player.name)) return;
		var game = _.last(this.games);
		if(!game || game.numberOfPlayers()==4) 
			this.games.push(game = new g.Game( p.createPack() ,p.emptyPack())); // after testing we have to change it as g.Game( p.createPack() ,p.emptyPack()))
		game.addPlayer(player);
	},
	gameOf : function(name){
		return _.find(this.games,function(g){
			return g.hasPlayer(name)
		});
	}
};	
module.exports= Games;