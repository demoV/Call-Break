var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var g = require('../javascript/game.js').game;
var player = require("../javascript/player.js").entities;

describe("addPlayer",function(){
	var game,player1,player2,player3,player4;

	beforeEach(function(){
		game=new g.Game();
		player1=new player.Player("A");
		player2=new player.Player("B");
		player3=new player.Player("C");
		player4=new player.Player("D");
	});

	it("cannot add more than 4 players",function() {
		var player5=new player.Player("E");
		game.addPlayer(player1)			
		game.addPlayer(player2);
		game.addPlayer(player3);
		game.addPlayer(player4);
		game.addPlayer(player5);

		expect(game.hasPlayer(player1)).to.be.true;
		expect(game.hasPlayer(player2)).to.be.true;
		expect(game.hasPlayer(player3)).to.be.true;
		expect(game.hasPlayer(player4)).to.be.true;
		expect(game.hasPlayer(player5)).to.be.false;
	});	
}); 

describe("canStartGame",function(){
	var game;
	var player1,player2,player3,player4;

	beforeEach(function(){
		game=new g.Game();
		player1=new player.Player("A");
		player2=new player.Player("B");
		player3=new player.Player("C");
		player4=new player.Player("D");
	});

	it("should start when there are four players",function() {
		game.addPlayer(player1);
		game.addPlayer(player2);
		game.addPlayer(player3);
		game.addPlayer(player4);

		expect(game.canStartGame()).to.be.true;
	});

	it("should not start when there are fewer than four players",function() {
		game.addPlayer(player1);
		game.addPlayer(player2);
		game.addPlayer(player3);

		expect(game.canStartGame()).to.be.false;
	});	
}); 