var ld = require('lodash');
var entities = {};
exports.entities = entities;

entities.Player = function(name){
	Object.defineProperties(this, {
		'name': {
			value: name || 'player',
			enumerable: true
		},
		'hands': {
			value: { diamonds: [], clubs: [], hearts: [], spades: [] },
			enumerable: true,
			writable: true
		}
	});
};
entities.Player.prototype = {
	throwCard: function(cardName){
		var suit = cardName.split('_')[2];
		return ld.remove(this.hands[suit], function(card){
			return card == cardName;
		});
	}
};

