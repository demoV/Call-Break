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
var flattedAllSuitCards = function(player){
	return ld.flattenDeep(Object.keys(player).map(function(suit){
		return player[suit].map(function(card){
			return card;
		});
	}));
};

var isHandsCardsAreCorrect = function(allplayers){
	var isGreaterThan10 = function(card){
		return card.rank > 10;
	};
	isSpade = function(card){
		return card.suit == 'spades';
	};
	var checkhands = function(allplayers){
		return Object.keys(allplayers).every(function(player){
			var player = allplayers[player].hands;
			var allCardsOfplayer = flattedAllSuitCards(player);
			return ld.some(allCardsOfplayer,isGreaterThan10) && ld.some(allCardsOfplayer,isSpade);
		});
	};
	return checkhands(allplayers);
}

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
	},
	throwableCards: function(playerName){
		if(!this.deck.thrownCards.length){
			return throwableCardsForFirstPlayer(this, playerName);
		}
		var spadeCards = this.players[playerName].hands['spades'];
		var ledSuit = this.deck.ledSuit;
		var ledSuitCards = this.players[playerName].hands[ledSuit];
		var highestCard = this.deck.highestCard().card;
		if(ledSuitCards.length)
			return throwableCardsOfLedSuit(this, playerName, ledSuit, highestCard)
		if(ledSuit != 'spades' && spadeCards.length)
			return throwableCardsIfNotHaveLedSuit(this, playerName, spadeCards, highestCard);
		return throwableCardsForFirstPlayer(this, playerName);
	}
};

var throwableCardsForFirstPlayer = function(self, playerName){
	return ld.flatten([self.players[playerName].hands['diamonds'],
				self.players[playerName].hands['hearts'],
				self.players[playerName].hands['clubs'],
				self.players[playerName].hands['spades'] ]);
};
var throwableCardsOfLedSuit = function(self, playerName, ledSuit, highestCard){
	if(ledSuit == highestCard.suit)	
		return self.players[playerName].hands[ledSuit].filter(function(card){
				return card.rank > highestCard.rank;
			});
	return this.players[playerName].hands[ledSuit];
};
var throwableCardsIfNotHaveLedSuit = function(self, playerName, spadeCards, highestCard){
	if(highestCard.suit != "spades")
		return spadeCards;
	return spadeCards.filter(function(card){
		return card.rank > highestCard.rank;
	});
}