var ld = require('lodash');
var lib = {};
exports.lib = lib;

lib.Card = function(suit , rank){
	Object.defineProperties(this,{
		'suit': {
		        value : suit,
		        enumerable : true,
		},
		'rank': {
		        value : rank,
		        enumerable : true,
		}
	});
};	

lib.Card.prototype = {
	toString : function() {
		var rankName = ['two' , 'three' , 'four' ,'five' , 'six' , 'seven' , 'eight',
						'nine','ten' , 'jack' , 'queen' , 'king' ,'ace'];
		return [rankName[this.rank-2],'of' , this.suit].join('_');
	}
};

lib.generatePack = function(){
	var ranks = [2,3,4,5,6,7,8,9,10,11,12,13,14];
	var suits = ['clubs' , 'diamonds' , 'hearts' , 'spades'];
	var array_of_cards = ld.map(ranks , function(rank){
		return ld.map(suits , function(suit){
			return new lib.Card(suit , rank);
			});
		});
	return ld.flatten(array_of_cards);
};