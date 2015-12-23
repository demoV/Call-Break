var Card=require("./card.js").lib.Card;
var Suits=Card.suits;
var ld=require('lodash')
var lib={};
exports.lib=lib;

lib.throwableCards=function(winningCard,runningSuit,hand) {
	var sameSuit=hand.cardsOfSuit(runningSuit);
	var sameSuitHigherRank=sameSuit;
	if(winningCard.suit==runningSuit)
		sameSuitHigherRank=sameSuit.cardsHigherThan(winningCard.rank);
	var allSpades=hand.cardsOfSuit(Suits.spades);
	var allSpadesHIgherRank=allSpades;
	if(winningCard.suit==Suits.spades)
		allSpadesHIgherRank=allSpades.cardsHigherThan(winningCard.rank);
	var handPriority=[sameSuitHigherRank,sameSuit,allSpadesHIgherRank,hand];
	return ld.find(handPriority,function(hand){
		return hand.numberOfCards()>0;
	});
}