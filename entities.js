var entities = {};
exports.entities = entities;

entities.Card = function(suit , rank){
	this.suit = suit;
	this.rank = rank;
};
entities.Card.prototype.toString = function() {
	var rankName = ['two' , 'three' , 'four' ,'five' , 'six' , 'seven' , 'eight',
					'nine','ten' , 'jack' , 'queen' , 'king' ,'ace'];
	return [rankName[this.rank-2],'of' , this.suit].join('_');
};