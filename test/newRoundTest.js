var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var ld=require("lodash");
var g = require('../lib/game.js').game;
var player = require("../lib/player.js").entities;
var p = require("../lib/pack.js").lib;
var cardIdGenerator=require("../lib/cardIdGenerator.js").lib;
var Card = require('../lib/card.js').lib.Card;
var Suits = Card.suits;

var player1,player2,player3,player4,c1,c2,c3,c4,c5,c6,c7,c8;
var game;

var convertHandsToPack=function(hands) {
	var handsAsCards=hands.map(function(hand){
		return hand.map(cardIdGenerator.toCard);
	});
	var zippedPack=ld.flattenDeep(ld.zip.apply(null,handsAsCards));
	return p.packWith(zippedPack,noShuffler);
}

var noShuffler=function(cards) {
	return cards;
}



describe("collect thrown cards",function(){
	beforeEach(function(){
	player1=new player.Player("A");
	player2=new player.Player("B");
	player3=new player.Player("C");
	player4=new player.Player("D");


	c1 = new Card(Suits.spades, 2);
	c2 = new Card(Suits.spades, 3);
	c3 = new Card(Suits.spades, 4);
	c4 = new Card(Suits.spades, 5);
	c5 = new Card(Suits.diamonds, 2);
	c6 = new Card(Suits.diamonds, 3);
	c7 = new Card(Suits.diamonds, 4);
	c8 = new Card(Suits.diamonds, 5);
	
	var hands=[["2S","2D"],["3S","3D"],["4S","4D"],["5S","5D"]];
	var pack=convertHandsToPack(hands);
	var emptyPack = p.emptyPack();
	game=new g.Game(pack, emptyPack);

	game.addPlayer(player1);
	game.addPlayer(player2);
	game.addPlayer(player3);
	game.addPlayer(player4);
	game.start();
});
	it("should take cards of first turn and give to discardPile",function() {
		game.makePlay('A', '2S');
		game.makePlay('B', '3S');
		game.makePlay('C', '4S');
		game.makePlay('D', '5S');

		// var c1 = new Card(Suits.spades, 2);
		// var c2 = new Card(Suits.spades, 3);
		// var c3 = new Card(Suits.spades, 4);
		// var c4 = new Card(Suits.spades, 5);
		game.collectThrownCards();
		
		expectedPack = {
			cards: [c1, c2, c3, c4]
		}

		expect(game.discardPile.cards).to.eql(expectedPack.cards);
	});	
	it("should take cards of each turn and give to discardPile",function() {
		game.makePlay('A', '2S');
		game.makePlay('B', '3S');
		game.makePlay('C', '4S');
		game.makePlay('D', '5S');

		game.collectThrownCards();

		game.makePlay('A', '2D');
		game.makePlay('B', '3D');
		game.makePlay('C', '4D');
		game.makePlay('D', '5D');
		
		game.collectThrownCards();
		
		expectedPack = {
			cards: [c1, c2, c3, c4, c5, c6, c7, c8]
		}
		expect(game.discardPile.cards).to.eql(expectedPack.cards);
	});	
}); 