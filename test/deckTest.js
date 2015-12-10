var Deck = require('../javascript/deck.js').Deck;
var cardModule = require('../javascript/card.js').lib;
var p=require("../javascript/pack.js").lib;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('deck', function(){
	var pack = p.createPack();
	var deck = new Deck();
	deck.thrownCards.push({card: {suit: 'diamonds', rank: 5}, playerId:'1'},
						 {card: {suit: 'diamonds', rank: 10}, playerId: '2'},
						 {card: {suit: 'diamonds', rank: 13}, playerId: '3'},
						 {card: {suit: 'diamonds', rank: 9}, playerId: '4'});
	it('gives led suit of hand', function(){
		expect(deck.ledSuit).to.eql('diamonds');
	});
	describe('highestCard', function(){
		it('can give the highest card of deck', function(){
			var highestCard = deck.highestCard();
			expect(highestCard.card).to.eql({suit: 'diamonds', rank: 13});
		});
		it("takes 'spades' card as highest priority", function(){
			var deck = new Deck();
			deck.thrownCards.push({card: {suit: 'diamonds', rank: 5}, playerId:'1'},
						 {card: {suit: 'diamonds', rank: 10}, playerId: '2'},
						 {card: {suit: 'diamonds', rank: 13}, playerId: '3'},
						 {card: {suit: 'spades', rank: 3}, playerId: '4'});
			var highestCard = deck.highestCard().card;
			expect(highestCard).to.eql( {suit: 'spades', rank: 3});
		});
		it('also gives playerId,', function(){
			var highestCard = deck.highestCard();
			expect(highestCard.playerId).to.eql('3');
		});
		it("takes 'spades'  priority", function(){
			var deck = new Deck();
			deck.thrownCards.push({card: {suit: 'diamonds', rank: 10}, playerId: '2'},
						 		{card: {suit: 'diamonds', rank: 13}, playerId: '3'},
						 		{card: {suit: 'spades', rank: 3}, playerId: '4'},
						 	{card: {suit: 'diamonds', rank: 5}, playerId:'1'});
			var highestCard = deck.highestCard().card;
			expect(highestCard).to.eql( {suit: 'spades', rank: 3});
		});
	})
})