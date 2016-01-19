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
	var pack=new Pack(ld.flatten(array_of_cards),ld.shuffle);
	return pack;
};

lib.emptyPack = function() {
	return new Pack([],ld.shuffle);
}

lib.packWith=function(cards,shuffler){
	return new Pack(cards,shuffler);
}

var Pack=function(cards,shuffler) {
	this.cards=cards;
	this.shuffler=shuffler;
}

Pack.prototype = {
	drawTopCard:function() {
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
	},
	cardsHigherThan:function(rank){
		var filteredCards=this.cards.filter(function(card){
			return card.rank>rank;
		});
		return new Pack(filteredCards);
	},
	addCard:function(card) {
		this.cards.push(card);
	},
	removeCard:function(card) {
		var result=ld.remove(this.cards,card);
		return result[0];
	},
	map:function(callback) {
		return this.cards.map(callback);
	},
	shuffle:function() {
		this.cards=this.shuffler(this.cards);
	},
}