var ld = require('lodash');
var pack = require('./card.js').lib.generatePack();
var Player = require('./player.js').entities.Player;
var Deck = require('./Deck.js').Deck;
var pointTable = require('./pointTable.js');

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
	this.pointTable = {updateScoreBoard : pointTable[save], showScoreBoard : pointTable[showPointTable]}
};

exports.CreateGame.prototype = {
	shuffle : function(pack){
		return ld.shuffle(pack);
	},
	distribute : function(){
		var playerId = Object.keys(this.players);
		var shuffledCards = this.shuffle(this.pack);
		var self = this;
		shuffledCards.forEach(function(card,index){
			self.players[playerId[index%4]].hands[card.suit].push(card);
		});
		if(!isHandsCardsAreCorrect(this.players)){
			var self = this.players;
			Object.keys(this.players).forEach(function(player){
				self[player].hands = {diamonds: [], clubs: [], hearts: [], spades: []};
			});
			this.distribute();
		};
	},
	writeCall: function(players,player,call){
		players[player].call = call;
	}
};

var cardsInImg = function(hands){
	var keys = Object.keys(hands);
	return ld.flatten(keys.map(function(suit){
		return hands[suit].sort(function(a,b){return b.rank - a.rank}).map(function(card){
			return card.rank+(card.suit.slice(0,1)).toUpperCase()+'.png';
		});
	}));
};

var generateTableData = function(hands){
	return hands.map(function(card){
		return '<td>'+'<img src="./resource/'+card+'">'+'</td>'
	});
};

var flattedAllSuitCards = function(player){
	return ld.flattenDeep(Object.keys(player).map(function(suit){
		return player[suit].map(function(card){
			return card;
		});
	}));
};

var isGreaterThan10 = function(card){
	return card.rank > 10;
};

var isSpade = function(card){
	return card.suit == 'spades';
};

var isHandsCardsAreCorrect = function(allplayers){
	return Object.keys(allplayers).every(function(player){
		var player = allplayers[player].hands;
		var allCardsOfplayer = flattedAllSuitCards(player);
		return ld.some(allCardsOfplayer,isGreaterThan10) && ld.some(allCardsOfplayer,isSpade);
	});
};
