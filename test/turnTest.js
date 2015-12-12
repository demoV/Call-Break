var Turn = require('../javascript/turn.js').Turn;
var cardModule = require('../javascript/card.js').lib;
var Card=cardModule.Card;
var Suits=Card.suits;
var p=require("../javascript/pack.js").lib;
var Player=require("../javascript/player.js").entities.Player;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var player1,player2,player3,player4;

beforeEach(function(){
	p1=new Player("A");
	p2=new Player("B");
	p3=new Player("C");
	p4=new Player("D");
})

describe('turn', function(){
	var pack = p.createPack();
	var c1,c2,c3,c4;
	var turn;
	beforeEach(function(){
		turn=new Turn();
		
		c1=new Card(Suits.diamonds,5);
		c2=new Card(Suits.diamonds,10);
		c3=new Card(Suits.diamonds,13);
		c4=new Card(Suits.diamonds,9);
		
		turn.addPlay({player:p1,card:c1});
		turn.addPlay({player:p2,card:c2});
		turn.addPlay({player:p3,card:c3});
		turn.addPlay({player:p4,card:c4});

	});
	it('gives led suit of hand', function(){
		expect(turn.runningSuit()).to.eql(Suits.diamonds);
	});
	describe('winningPlay', function(){
		it('can give the highest card of turn', function(){
			var highestCard = turn.winningPlay();
			expect(turn.winningPlay()).to.eql({player:p3,card:c3});
		});
		// it("takes 'spades' card as highest priority", function(){
		// 	var turn = new turn();
		// 	turn.thrownCards.push({card: {suit: 'diamonds', rank: 5}, playerId:'1'},
		// 				 {card: {suit: 'diamonds', rank: 10}, playerId: '2'},
		// 				 {card: {suit: 'diamonds', rank: 13}, playerId: '3'},
		// 				 {card: {suit: 'spades', rank: 3}, playerId: '4'});
		// 	var highestCard = turn.highestCard().card;
		// 	expect(highestCard).to.eql( {suit: 'spades', rank: 3});
		// });
		// it('also gives playerId,', function(){
		// 	var highestCard = turn.highestCard();
		// 	expect(highestCard.playerId).to.eql('3');
		// });
		// it("takes 'spades'  priority", function(){
		// 	var turn = new turn();
		// 	turn.thrownCards.push({card: {suit: 'diamonds', rank: 10}, playerId: '2'},
		// 				 		{card: {suit: 'diamonds', rank: 13}, playerId: '3'},
		// 				 		{card: {suit: 'spades', rank: 3}, playerId: '4'},
		// 				 	{card: {suit: 'diamonds', rank: 5}, playerId:'1'});
		// 	var highestCard = turn.highestCard().card;
		// 	expect(highestCard).to.eql( {suit: 'spades', rank: 3});
		// });
	})
});