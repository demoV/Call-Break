var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var lib=require("../lib/pack.js").lib;
var Card=require("../lib/card.js").lib.Card;
var Suits=Card.suits;

var pack;
beforeEach(function(){
	pack=lib.createPack();
})


describe('createPack', function(){
	it('should have length 52', function(){
		expect(pack.numberOfCards()).to.equal(52);
	});
	it('should have 13 cards of each suit', function(){
		var diamonds = pack.cardsOfSuit(Suits.diamonds);
		var clubs = pack.cardsOfSuit(Suits.clubs);
		var spades = pack.cardsOfSuit(Suits.spades);
		var hearts = pack.cardsOfSuit(Suits.hearts);
		var triangles = pack.cardsOfSuit("triangle");

		expect(diamonds.numberOfCards()).to.equal(13);
		expect(clubs.numberOfCards()).to.equal(13);
		expect(spades.numberOfCards()).to.equal(13);
		expect(hearts.numberOfCards()).to.equal(13);
		expect(triangles.numberOfCards()).to.equal(0);
	});
});

describe("addCard",function(){
	var emptyPack;
	beforeEach(function(){
		emptyPack = lib.emptyPack();
	});
	it("should add a given card",function() {
		var card = new Card(Suits.clubs, 7);
		var secondCard = new Card(Suits.clubs, 5);
		
		emptyPack.addCard(card);
		expect(emptyPack.cards).to.eql([card]);

		expect(emptyPack.cards).to.have.length(1);
		
		emptyPack.addCard(secondCard);
		expect(emptyPack.cards).to.have.length(2);
		expect(emptyPack.cards).to.eql([card, secondCard]);
	});	
}); 

describe("removeCard",function(){
	it("should remove a given card from pack",function() {
		var card=new Card(Suits.diamonds,2);
		var removedCard=pack.removeCard(card);
		expect(removedCard).to.eql(card);
		expect(pack.numberOfCards()).to.equal(51);				
	});	
	it("should not be able to remove a card not in the pack",function(){
		var card=new Card("Triangle",2);
		var removedCard=pack.removeCard(card);
		expect(removedCard).to.be.undefined;
		expect(pack.numberOfCards()).to.equal(52);				
	});
}); 

describe("topCard",function(){
	it("should draw the top card in the pack",function() {
		expect(pack.drawTopCard()).to.eql(new Card(Card.suits.clubs,2));	
	});	
}); 