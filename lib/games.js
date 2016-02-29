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
// var pack = p.packWith(cards, suffler);

///////////////////////////////////////////////////////////////////////////////

// var pack = p.createPack();
var Games = function() {
	this.games = [];
	this.botGames = [];
};

Games.prototype = {
	get count(){
		return this.games.length;
	},
	addPlayer : function(player){
		if(this.gameOf(player.name)) return;
		var game = _.last(this.games);
		if(!game || game.numberOfPlayers()==4)
			this.games.push(game = new g.Game( p.createPack() ,p.emptyPack()));
		game.addPlayer(player);
	},
	gameOf : function(name){
		return _.find(this.games,function(g){
			return g.hasPlayer(name)
		});
	},
	removeGameOf: function(playerName){
		var game = this.botGameOf(playerName);
		_.remove(this.botGames, function(g){
			return _.isEqual(game, g);
		});
	},
	addPlayerToBotGame : function(player){
		if(this.botGameOf(player.name)) return;
		var game = _.last(this.botGames);
		if(!game || game.numberOfPlayers()==4)
			this.botGames.push(game = new g.Game( p.createPack() ,p.emptyPack()));
		game.addPlayer(player);
	},
	botGameOf: function(playerName){
		return _.find(this.botGames,function(g){
			return g.hasPlayer(playerName);
		});
	}

};	
module.exports= Games;