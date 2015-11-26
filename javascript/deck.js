var ld = require('lodash');

exports.Deck = function(){
	this.thrownCards = [];
};
exports.Deck.prototype = {
	get ledSuit(){
		return (this.thrownCards[0].card.suit);
	},
	get firstCard(){
		return this.thrownCards[0];
	},
	highestCard: function(){
		var ledCard = this.firstCard;
		return getHighestCard(this, ledCard);
	}
};

var getHighestCard = function(self, ledCard){
	self.thrownCards.forEach(function(c){
		if(c.card.suit == self.ledSuit && c.card.rank > ledCard.card.rank)
			ledCard = c;
		if(c.card.suit == 'spades' && ledCard.card.suit != 'spades'){
			ledCard = c;
		}
		if(ledCard.card.suit == 'spades' && c.card.suit == 'spades' 
			&& c.card.rank > ledCard.card.rank)
			ledCard = c;
		});
		return ledCard;
}