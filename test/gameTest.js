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
describe('getPlayerNames',function(){
	it('should give the name ofn all players playing in the game',function(){
		var expected = ['A','B','C'];
		expect(game.getPlayersName()).to.be.eql(expected)
	});
});
describe("status",function(){
	it("should provide a status at the start of a game",function() {
		game.addPlayer(player4);
		game.start();
		var capturedDetail = {	
			A : {call : 0,captured : 0},
			B : {call : 0,captured : 0},
			C : {call : 0,captured : 0},
			D : {call : 0,captured : 0} 
		};
		var expectedStatus={
			deck:[],
			ledSuit: '',
			currentHand: {isOver:false, winner: ''},
			capturedDetail: capturedDetail,
			currentTurn:"A",
			isAllPlayerCalled : false,
			isRoundOver: false,
			pointTable : '',
			isGameOver : false,
			winner : ''
		};
		expect(game.status()).to.eql(expectedStatus);

	});
});
describe('callFor',function(){
	it('should write the call of given palyer',function(){
		game.callFor('A' ,2);
		expect(player1.round.call).to.be.eql(2);
	});
	it('should not write the call of given player if he is not current player',function(){
		game.callFor('B',2);
		expect(player2.round.call).to.be.eql(0);
	});
});
describe('isAllPlayerCalled',function(){
	it('should return true if all player have make call',function(){
		game.addPlayer(player4);
		game.callFor('A',2);	
		game.callFor('B',5);	
		game.callFor('C',4);	
		game.callFor('D',2);
		expect(game.isAllPlayerCalled()).to.be.eql(true);
	});
	it('should return false if all player have not make call',function(){
		game.addPlayer(player4);
		game.callFor('A',2);	
		game.callFor('B',5);	
		game.callFor('C',4);	

		expect(game.isAllPlayerCalled()).to.be.eql(false);
	});
});

describe('playerReadyToPlay',function(){
	it('should add player into playerOnTable',function(){
		game.playerReadyForPlay('A');
		game.playerReadyForPlay('A');
		expect(game.playerOnTable.length).to.equal(1);
		expect(game.hasPlayerOnTable('A')).to.be.eql(true);
	});
});
describe('isGameOver',function(){
	it('should give true if players have played five round',function(){
		game.pointTable.noOfPlayedRounds =  5;
		expect(game.isGameOver()).to.be.eql(true);
	});
});


