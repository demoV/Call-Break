var ld=require('lodash');
var Card=require("./card.js").lib.Card;
var Suits=Card.suits;
var lib={};
exports.lib=lib;

lib.toId=function(card) {
	return card.rank.toString()+card.suit[0].toUpperCase();
}

lib.toCard=function(id) {
	var rank=+id.slice(0,-1);
	var suitInitial=id.slice(-1).toLowerCase();
	var suit=ld.find(Object.keys(Suits),function(suit){
		return suit[0]==suitInitial;
	});
	return new Card(suit,rank);
}