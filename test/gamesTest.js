var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var Games = require('../lib/games.js');
var player = require("../lib/player.js").entities;
var p = require("../lib/pack.js").lib;
var games;
var player1,player2,player3,player4;

beforeEach(function(){
	var emptyPack = p.emptyPack();
	games=new Games();

	player1=new player.Player("A");
	player2=new player.Player("B");
	player3=new player.Player("C");
	player4=new player.Player("D");
	player5=new player.Player("E");

	games.addPlayer(player1)
	games.addPlayer(player2);
	games.addPlayer(player3);
});

describe("addPlayer",function(){
	it("should a player in a game",function() {
		games.addPlayer(player4);
		expect(games.count).to.be.equal(1);
	});

	it("should a player in a new game if there is no vacancy in last game",function() {
		games.addPlayer(player4);
		var game = games.gameOf(player4.name);
		game.start();
		expect(game.pack.numberOfCards()).to.be.eql(0);

		games.addPlayer(player5);
		expect(games.count).to.be.equal(2);
		var game = games.gameOf(player5.name);
		expect(game.pack.numberOfCards()).to.be.eql(52);
	});
});