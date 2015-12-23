var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var Card=require("../lib/card.js").lib.Card;
var cardIdGenerator=require("../lib/cardIdGenerator.js").lib;
var Suits=Card.suits;

describe("toId",function(){
	it("should generate the id of a given card",function() {
		var c1=new Card(Suits.diamonds,2);
		expect(cardIdGenerator.toId(c1)).to.equal("2D");
	});
});

describe("toCard",function(){
	it("should generate a Card with a given id",function() {
		var c1=new Card(Suits.diamonds,2);
		expect(cardIdGenerator.toCard("2D")).to.eql(c1);
	});
});
