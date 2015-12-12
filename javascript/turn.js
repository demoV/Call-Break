var ld = require('lodash');
var Suits=require('./card.js').lib.Card.suits;

exports.Turn = function(){
	this.plays=[];
};
exports.Turn.prototype = {
	runningSuit:function() {
		return this.plays[0].card.suit;
	},
	addPlay:function(play){
		this.plays.push(play);
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
	}

};
