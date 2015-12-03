var ld = require('lodash');
var pack = require('./card.js').lib.generatePack();
var Player = require('./player.js').entities.Player;
var Deck = require('./Deck.js').Deck;

var initialize_player = function(loginPlayers){
	var players = {};
	loginPlayers.forEach(function(player){
		players[player] = new Player(player);
	});
	return players;
};

exports.CreateGame = function(players){
	this.players = initialize_player(players);
	this.pack = pack;
	this.deck = new Deck();
	this.pointTable = '';
};

exports.CreateGame.prototype = {
	shuffle : function(pack){
		return ld.shuffle(pack);
	},
	distribute : function(){
		var playerId = Object.keys(this.players);
		if(!isCardsInHand(this.players[playerId[0]].hands))
			return;
		var shuffledCards = ld.shuffle(this.pack);
		var self = this;
		shuffledCards.forEach(function(card,index){
			self.players[playerId[index%4]].hands[card.suit].push(card);
		});
	},
	writeCall: function(players,player,call){
		players[player].call = call;
	}
};

var isCardsInHand = function(hands){
	var keys = Object.keys(hands);
	return keys.every(function(key){
		console.log(hands[key],key);
		return hands[key].length == 0;
	})
};
