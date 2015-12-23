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

lib.Card.suits = {
	clubs:"clubs",
	diamonds:"diamonds",
	hearts:"hearts",
	spades:"spades"
}

lib.Card.prototype = {
	toString : function() {
		var rankName = ['two' , 'three' , 'four' ,'five' , 'six' , 'seven' , 'eight',
						'nine','ten' , 'jack' , 'queen' , 'king' ,'ace'];
		return [rankName[this.rank-2],'of' , this.suit].join('_');
	}
};

