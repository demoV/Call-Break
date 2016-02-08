var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var ld=require("lodash");
var g = require('../lib/game.js').game;
var player = require("../lib/player.js").entities;
var p = require("../lib/pack.js").lib;
var cardIdGenerator=require("../lib/cardIdGenerator.js").lib;

var player1,player2,player3,player4;
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

beforeEach(function(){
	player1=new player.Player("A");
	player2=new player.Player("B");
	player3=new player.Player("C");
	player4=new player.Player("D");
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

describe("makePlay",function(){
	it("should know the first play made",function() {
		game.makePlay("A","2S");
		var expectedStatus={
			deck:[{card: '2S', playerId: 'A'}]
		};
		expect(game.status().deck).to.eql(expectedStatus.deck);
	});	
	it("should know all the plays for the first turn",function() {
		game.makePlay("A","2S");
		game.makePlay("B","3S");
		game.makePlay("C","4S");
		var expectedStatus={
			deck:[{card: '2S', playerId: 'A'},{card: '3S', playerId: 'B'},
				{card: '4S', playerId: 'C'}]			
		};
		expect(game.status().deck).to.eql(expectedStatus.deck);
	});
	it("should know the winner of the previous turn",function(){
		game.makePlay("A","2S");
		game.makePlay("B","3S");
		game.makePlay("C","4S");
		game.makePlay("D","5S");
		game.collectThrownCards();
		var expectedStatus={
			currentHand:{isOver:false,winner:"D"}			
		};
		expect(game.status().currentHand).to.eql(expectedStatus.currentHand);
	})
	it("should know who the current turn belongs to",function(){
		expect(game.status().currentTurn).to.equal("A");
		game.makePlay("A","2S");
		expect(game.status().currentTurn).to.equal("B");
	});
	// it("should create a new turn at the end of 4 plays",function(){
	// 	game.makePlay("A","2S");
	// 	game.makePlay("B","3S");
	// 	game.makePlay("C","4S");
	// 	game.makePlay("D","5S");
	// 	game.makePlay("A","2D");
	// 	var expectedStatus={
	// 		deck:[{card:"2D", playerId:'A'}]
	// 	}
	// 	expect(game.status().deck).to.eql(expectedStatus.deck);
	// });

}); 

describe("throwableCardsFor",function(){
	it("should return all cards for the first player of a game",function() {
		var throwableCards=game.throwableCardsFor("A");
		expect(throwableCards).to.eql(["2S","2D"]);
	});
	it("should return all cards of running suit for second player",function() {
		game.makePlay("A","2D");
		var throwableCards=game.throwableCardsFor("B");
		expect(throwableCards).to.eql(["3D"]);
	});	
	it("should return all cards of running suit for third player",function() {
		game.makePlay("A","2D");
		game.makePlay("B","3D");
		var throwableCards=game.throwableCardsFor("C");
		expect(throwableCards).to.eql(["4D"]);
	});
	it("should return all cards of running suit for the fourth player",function() {
		game.makePlay("A","2D");
		game.makePlay("B","3D");
		game.makePlay("C","4D");
		var throwableCards=game.throwableCardsFor("D");
		expect(throwableCards).to.eql(["5D"]);
	});
	it("should not serve throwable cards for person whose turn it isn't",function(){
		game.makePlay("A","2D");
		var throwableCards=game.throwableCardsFor("C");
		expect(throwableCards).to.eql([]);
	});
	it("should return all cards of trump if trump is played");
	it("should return all cards of trump if trump is running suit");
	it("should return all cards if running suit and trump not present");

}); 
describe("isCardThrowableFor",function(){
	it("shoud return false for not throwableCards",function() {
		var isThrowable = game.isCardThrowableFor('A','9D');
		expect(isThrowable).to.equal(false);
	});	
	it("shoud return true for throwableCards",function() {
		var isThrowable = game.isCardThrowableFor('A','2D');
		expect(isThrowable).to.equal(true);
	});	
}); 

describe("isRoundOver",function(){
	it("should give true if all player played all cards",function() {
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
		expect(game.isRoundOver()).to.be.true;
		game.startNewRound();
	});	
}); 
describe("setTurn",function(){
	it("shoud set the turn of the next player if turn is not over",function() {
		game.makePlay("A","2S");
		game.makePlay("B","3S");
		var currentPlayer = game.currentPlayer();
		expect(currentPlayer).to.eql(player3);
	});	
}); 

describe('status',function(){
	it('should give the winner name when game is over',function(done){
		game.callFor('A',2);
		game.callFor('B',2);
		game.callFor('C',2);
		game.callFor('D',2);

		game.pointTable.noOfTotalRounds = 1;

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
		done();
		expect(game.status().winner).to.be.eql('D');
	});
});

