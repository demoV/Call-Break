var packLib=require("../lib/pack.js").lib;
var Card=require("../lib/card.js").lib.Card;
var Suits=Card.suits;
var throwable=require("../lib/throwableCard.js").lib;
var ld=require("lodash");
var cardIdGenerator=require("../lib/cardIdGenerator.js").lib;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;


var convertHandToPack=function(hand) {
	var handsAsCards=hand.map(cardIdGenerator.toCard);
	return packLib.packWith(ld.flattenDeep(ld.zip(handsAsCards)));
}

var noShuffler=function(cards) {
	return cards;
}

describe("throwableCards",function(){
	it("should return all cards when winning card is lowest",function() {
		var winningCard=new Card(Suits.diamonds,2);
		var runningSuit=Suits.diamonds;
		var cardsInHand=["3D","4D","5D","6D","7D","8D","9D","10D","11D","12D","13D","14D","2C"];
		var expectedCards=["3D","4D","5D","6D","7D","8D","9D","10D","11D","12D","13D","14D"];
		var hand=convertHandToPack(cardsInHand);
		var expectedHand=convertHandToPack(expectedCards);
		var cards=throwable.throwableCards(winningCard,runningSuit,hand);
		expect(cards).to.eql(expectedHand);
	});

	it("should return all cards when winning card is not lowest but same suit is available",function() {
		var winningCard=new Card(Suits.diamonds,3);
		var runningSuit=Suits.diamonds;
		var cardsInHand=["2D","4D","5D","6D","7D","8D","9D","10D","11D","12D","13D","14D","2C"];
		var expectedCards=["4D","5D","6D","7D","8D","9D","10D","11D","12D","13D","14D"];
		var hand=convertHandToPack(cardsInHand);
		var expectedHand=convertHandToPack(expectedCards);
		var cards=throwable.throwableCards(winningCard,runningSuit,hand);
		expect(cards).to.eql(expectedHand);
	});

	it("should return all trump suit cards when running suit is not available",function(){
		var winningCard=new Card(Suits.clubs,3);
		var runningSuit=Suits.clubs;
		var cardsInHand=["2D","4D","5D","6D","7D","8D","9D","10D","11D","12D","13D","14D","2S"];
		var expectedCards=["2S"];
		var hand=convertHandToPack(cardsInHand);
		var expectedHand=convertHandToPack(expectedCards);
		var cards=throwable.throwableCards(winningCard,runningSuit,hand);
		expect(cards).to.eql(expectedHand);
	});

	it("should return all cards when running suit and trump is not available",function(){
		var winningCard=new Card(Suits.clubs,3);
		var runningSuit=Suits.clubs;
		var cardsInHand=["2D","4D","5D","6D","7D","8D","9D","10D","11D","12D","13D","14D"];
		var expectedCards=["2D","4D","5D","6D","7D","8D","9D","10D","11D","12D","13D","14D"];
		var hand=convertHandToPack(cardsInHand);
		var expectedHand=convertHandToPack(expectedCards);
		var cards=throwable.throwableCards(winningCard,runningSuit,hand);
		expect(cards).to.eql(expectedHand);
	});

	it("should return all same suit cards of lower rank when running suit of higher rank is unavailable",function(){
		var winningCard=new Card(Suits.diamonds,10);
		var runningSuit=Suits.diamonds;
		var cardsInHand=["2D","4D","5D","6D","7D","8D","9D","2C"];
		var expectedCards=["2D","4D","5D","6D","7D","8D","9D"];
		var hand=convertHandToPack(cardsInHand);
		var expectedHand=convertHandToPack(expectedCards);
		var cards=throwable.throwableCards(winningCard,runningSuit,hand);
		expect(cards).to.eql(expectedHand);
	});
	
	it("should return all same suit cards of running suit even if trump is available",function(){
		var winningCard=new Card(Suits.spades,2);
		var runningSuit=Suits.diamonds;
		var cardsInHand=["2D","4D","5D","6D","7D","8D","9D","3S"];
		var expectedCards=["2D","4D","5D","6D","7D","8D","9D"];
		var hand=convertHandToPack(cardsInHand);
		var expectedHand=convertHandToPack(expectedCards);
		var cards=throwable.throwableCards(winningCard,runningSuit,hand);
		expect(cards).to.eql(expectedHand);
	});

}); 