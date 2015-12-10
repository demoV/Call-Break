var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var lib=require("../javascript/pack.js").lib;
var Card=require("../javascript/card.js").lib.Card;
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


describe("topCard",function(){
	it("should draw the top card in the pack",function() {
		expect(pack.drawCard()).to.eql(new Card(Card.suits.clubs,2));	
	});	
}); 