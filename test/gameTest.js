var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var g = require('../lib/game.js').game;
var player = require("../lib/player.js").entities;
var p = require("../lib/pack.js").lib;
var game;
var player1,player2,player3,player4;

beforeEach(function(){
	var pack=p.createPack();
	var emptyPack = p.emptyPack();
	game=new g.Game(pack, emptyPack);

	player1=new player.Player("A");
	player2=new player.Player("B");
	player3=new player.Player("C");
	player4=new player.Player("D");

	game.addPlayer(player1)
	game.addPlayer(player2);
	game.addPlayer(player3);

});

describe("addPlayer",function(){
	it("cannot add more than 4 players",function() {
		var player5=new player.Player("E");
		game.addPlayer(player4);
		game.addPlayer(player5);

		expect(game.hasPlayer('A')).to.be.true;
		expect(game.hasPlayer('B')).to.be.true;
		expect(game.hasPlayer('C')).to.be.true;
		expect(game.hasPlayer('D')).to.be.true;
		expect(game.hasPlayer('E')).to.be.false;
	});
});

describe("canStartGame",function(){
	it("should start when there are four players",function() {
		expect(game.canStartGame()).to.be.false;
		game.addPlayer(player4);
		expect(game.canStartGame()).to.be.true;
	});

	it("should not start when there are fewer than four players",function() {
		expect(game.canStartGame()).to.be.false;
	});
});

describe("getPlayerSequenceFor",function(){
	it("should provide the original sequence for the first player",function() {
		game.addPlayer(player4);

		expect(game.getPlayerSequenceFor(player1.name)).to.eql(["A","B","C","D"]);
		expect(game.getPlayerSequenceFor(player2.name)).to.eql(["B","C","D","A"]);
		expect(game.getPlayerSequenceFor(player3.name)).to.eql(["C","D","A","B"]);
		expect(game.getPlayerSequenceFor(player4.name)).to.eql(["D","A","B","C"]);
	});

	it("should throw an error for a player not in the game");
});

describe("start",function(){
	it("should make player1 the first player",function() {
		game.addPlayer(player4);
		game.start();
		expect(game.currentPlayer()).to.be.eql(player1);
	});
 	it("should distribute 13 cards to each player",function() {
 		game.addPlayer(player4);
 		game.start();
 		expect(game.handOf(player1.name).numberOfCards()).to.equal(13);
 		expect(game.handOf(player2.name).numberOfCards()).to.equal(13);
 		expect(game.handOf(player3.name).numberOfCards()).to.equal(13);
 		expect(game.handOf(player4.name).numberOfCards()).to.equal(13);
 	});
 	it("should not start game unless there are four players");
});
describe("status",function(){
	it("should provide a status at the start of a game",function() {
		game.addPlayer(player4);
		game.start();
		var expectedStatus={
			deck:[],
			ledSuit: '',
			currentHand: {isOver:false, winner: ''},
			capturedDetail: {A:0,B:0,C:0,D:0},
			currentTurn:"A",
			isRoundOver: false
		};
		expect(game.status()).to.eql(expectedStatus);

	});	
});





