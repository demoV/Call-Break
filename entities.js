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
			value: [],
			enumerable: true,
			writable: true
		}
	});
};

entities.Player.prototype = {
	throwCard: function(card){
		return ld.remove(this.hands, card);
	},
	makeCall: function(){

	}
};