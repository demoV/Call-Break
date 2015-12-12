var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var ld=require("lodash");
var g = require('../javascript/game.js').game;
var player = require("../javascript/player.js").entities;
var p = require("../javascript/pack.js").lib;
var cardIdGenerator=require("../javascript/cardIdGenerator.js").lib;
var player1,player2,player3,player4;

var convertHandsToPack=function(hands) {
	var handsAsCards=hands.map(function(hand){
		return hand.map(cardIdGenerator.toCard);
	});
	return p.packWith(ld.flattenDeep(ld.zip(handsAsCards)),noShuffler);
}

var noShuffler=function(cards) {
	return cards;
}

beforeEach(function(){
	player1=new player.Player("A");
	player2=new player.Player("B");
	player3=new player.Player("C");
	player4=new player.Player("D");
});

/*
   [ { suit: 'diamonds', rank: 4 },
     { suit: 'diamonds', rank: 10 } ],
  clubs: 
   [ { suit: 'clubs', rank: 10 },
     { suit: 'clubs', rank: 9 },
     { suit: 'clubs', rank: 11 } ],
  hearts: 
   [ { suit: 'hearts', rank: 11 },
     { suit: 'hearts', rank: 14 },
     { suit: 'hearts', rank: 8 } ],
  spades: 
   [ { suit: 'spades', rank: 4 },
     { suit: 'spades', rank: 13 },
     { suit: 'spades', rank: 14 },
     { suit: 'spades', rank: 8 },
     { suit: 'spades', rank: 7 } ]
*/     

describe("makePlay",function(){
	it("should know the first play made",function() {
		var hands=[["2S"],["3S"],["4S"],["5S"]];
		var pack=convertHandsToPack(hands);
		var game=new g.Game(pack);

		game.addPlayer(player1);
		game.addPlayer(player2);
		game.addPlayer(player3);
		game.addPlayer(player4);
		game.start();

		game.makePlay("A","2S");
		var expectedStatus={
			deck:["2S"]
		};
		expect(game.status().deck).to.eql(expectedStatus.deck);
	});	

	it("should know who the current turn belongs to",function(){
		var hands=[["2S"],["3S"],["4S"],["5S"]];
		var pack=convertHandsToPack(hands);
		var game=new g.Game(pack);

		game.addPlayer(player1);
		game.addPlayer(player2);
		game.addPlayer(player3);
		game.addPlayer(player4);
		game.start();

		expect(game.status().currentTurn).to.equal("A");
		game.makePlay("A","2S");
		expect(game.status().currentTurn).to.equal("B");
	});

}); 