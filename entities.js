var ld = require('lodash');
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

entities.generatePack = function(){
	var ranks = [2,3,4,5,6,7,8,9,10,11,12,13,14];
	var suits = ['clubs' , 'diamonds' , 'hearts' , 'spades'];
	var array_of_cards = ld.map(ranks , function(rank){
		return ld.map(suits , function(suit){
			return new entities.Card(suit , rank);
			});
		});
	return ld.flatten(array_of_cards);
};