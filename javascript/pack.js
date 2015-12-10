var Card=require("./card.js").lib.Card;
var ld=require("lodash");
var lib={};
exports.lib=lib;

lib.createPack = function(){
	var ranks = [2,3,4,5,6,7,8,9,10,11,12,13,14];
	var suits = ['clubs' , 'diamonds' , 'hearts' , 'spades'];
	var array_of_cards = ld.map(ranks , function(rank){
		return ld.map(suits , function(suit){
			return new Card(suit , rank);
			});
		});
	var pack=new Pack(ld.flatten(array_of_cards));
	return pack;
};


var Pack=function(cards) {
	this.cards=cards;
}

Pack.prototype = {
	drawCard:function() {
		return this.cards.shift();
	},
	numberOfCards:function() {
		return this.cards.length;
	},
	cardsOfSuit:function(suit){
		var filteredCards=this.cards.filter(function(card){
			return card.suit==suit;
		});
		return new Pack(filteredCards);
	}
}