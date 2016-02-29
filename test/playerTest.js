var entities = require('../lib/player.js').entities;
var Card = require("../lib/card.js").lib.Card;
var Suits = Card.suits;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Player', function(){
	var Player = entities.Player;
	var player = new Player('new');
	it('should be able to receive a card and add it to its hand', function(){
		var card=new Card(Suits.diamonds,2);
		player.addCardToHand(card);
		expect(player.throwCard(card)).to.eql(card);
	});	
	it('should have prototype throwCard', function(){
		expect(player).to.respondTo('throwCard');
	});
	it('can make call for every round', function(){
		var demo = new Player('demo');
		demo.turn = true;
		demo.makeCall(5);
		expect(demo.round.call).to.eql(5).that.is.a('number');
	});
	
	it("can't make call less than 2 ", function(){
		var demo = new Player('demo');
		demo.turn = true;
		demo.makeCall(1);
		expect(demo.round.call).to.eql(2).that.is.a('number');
		demo.makeCall(0);
		expect(demo.round.call).to.eql(2).that.is.a('number');
	});
	
	it('can not call 2 or more times in one round', function(){
		var demo = new Player('demo');
		demo.turn = true;
		demo.makeCall(4);
		expect(demo.round.call).to.eql(4).that.is.a('number');
		demo.makeCall(5);
		expect(demo.round.call).to.eql(4).that.is.a('number');
	})
});