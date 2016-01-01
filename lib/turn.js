var ld = require('lodash');
var Suits=require('./card.js').lib.Card.suits;
var cardIdGenerator=require("./cardIdGenerator.js").lib;
var throwable=require("./throwableCard.js").lib;

exports.Turn = function(){
	this.plays=[];
};
exports.Turn.prototype = {
	runningSuit:function() {
		var firstPlay=this.plays[0];
		if(firstPlay)
			return firstPlay && firstPlay.card.suit;
		return '';
	},
	addPlay:function(play){
		this.plays.push(play);
		play.player.throwCard(play.card);
	},
	winningPlay:function() {
		var runningSuit=this.runningSuit();
		return this.plays.reduce(function(play1,play2){
			var ledCard=play1.card;
			var c=play2.card;
			if(c.suit == runningSuit && c.rank > ledCard.rank && ledCard.suit == runningSuit)
				return play2
			if(c.suit == Suits.spades && ledCard.suit != Suits.spades)
				return play2
			if(ledCard.suit == Suits.spades && c.suit == Suits.spades && c.rank > ledCard.rank)
				return play2
			return play1;
		});
	},
	cardIds:function() {
		return this.plays.map(function(play){
			return {playerId: play.player.name, card: cardIdGenerator.toId(play.card)};
		});
	},
	numberOfPlaysSoFar:function() {
		return this.plays.length;
	},
	throwableCardsIn:function(hand) {
		if(!this.runningSuit())
			return hand;		
		return throwable.throwableCards(this.winningPlay().card,this.runningSuit(),hand);
	},
	thrownCards: function(){
		return this.plays.map(function(thrownCardOfPlayer){
			return thrownCardOfPlayer.card;
		})
	}
};
