var ld = require('lodash');

var entities = {};
exports.entities = entities;


entities.dealer = {
	shuffle : function(pack){
		return ld.shuffle(pack);
	},
	distribute : function(players,pack){
		var playerId = Object.keys(players);
		var shuffledCards = entities.dealer.shuffle(pack);
		shuffledCards.forEach(function(card,index){
			players[playerId[index%4]].hands[card.suit].push(card);
		});
	},
	writeCall: function(players,player,call){
		players[player].call = call;
	}
};