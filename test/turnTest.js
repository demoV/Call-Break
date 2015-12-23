var Turn = require('../lib/turn.js').Turn;
var cardModule = require('../lib/card.js').lib;
var Card=cardModule.Card;
var Suits=Card.suits;
var p=require("../lib/pack.js").lib;
var Player=require("../lib/player.js").entities.Player;
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
		
		c1=new Card(Suits.diamonds,2);
		c2=new Card(Suits.diamonds,3);
		c3=new Card(Suits.diamonds,4);
		c4=new Card(Suits.diamonds,5);
		
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
			expect(turn.winningPlay()).to.eql({player:p4,card:c4});
		});
	});
	describe("throwableCards",function(){
		it("considers all cards of the first player of a turn to be throwable",function(){
			var turn=new Turn();
			var hand=p.packWith([c1,c2,c3,c4]);
			var throwableCards=turn.throwableCardsIn(hand);
			expect(throwableCards).to.eql(hand);
		});
		it("only higher ranked cards of the running suit after the first player",function() {
			var turn=new Turn();
			turn.addPlay({player:p1,card:c1});
			var c5=new Card(Suits.spades,2);
			var c6=new Card(Suits.clubs,3);
			var playersHand=p.packWith([c2,c3,c4,c5,c6]);
			var expectedThrowable=p.packWith([c2,c3,c4]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("only trump if running suit is not available",function() {
			var turn=new Turn();
			turn.addPlay({player:p1,card:c1});
			var c5=new Card(Suits.spades,2);
			var c6=new Card(Suits.clubs,3);
			var playersHand=p.packWith([c5,c6]);
			var expectedThrowable=p.packWith([c5]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("any card if trump or running suit is not available",function() {
			var turn=new Turn();
			turn.addPlay({player:p1,card:c1});
			var c6=new Card(Suits.clubs,3);
			var playersHand=p.packWith([c6]);
			var expectedThrowable=p.packWith([c6]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("only running suit cards if running suit is available, even if trump has been played",function() {
			var turn=new Turn();
			turn.addPlay({player:p1,card:c1});
			var c5=new Card(Suits.spades,2);
			turn.addPlay({player:p2,card:c5});
			var c6=new Card(Suits.clubs,3);
			var playersHand=p.packWith([c2,c3,c4,c6]);
			var expectedThrowable=p.packWith([c2,c3,c4]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("only higher ranked running suit cards if available",function() {
			var turn=new Turn();
			turn.addPlay({player:p1,card:c2});
			var playersHand=p.packWith([c1,c3,c4]);
			var expectedThrowable=p.packWith([c3,c4]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("only lower ranked running suit cards if higher ranked card not available",function() {
			var turn=new Turn();
			turn.addPlay({player:p1,card:c2});
			var c6=new Card(Suits.clubs,3);
			var playersHand=p.packWith([c1,c6]);
			var expectedThrowable=p.packWith([c1]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("any card if trump of higher card not available",function() {
			var turn=new Turn();
			turn.addPlay({player:p1,card:c2});
			var c5=new Card(Suits.spades,5);
			var c6=new Card(Suits.spades,2);
			var c7=new Card(Suits.clubs,5);
			turn.addPlay({player:p2,card:c5});
			var playersHand=p.packWith([c6,c7]);
			var expectedThrowable=p.packWith([c6,c7]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("only higher trump can be played if running suit is trump and is available",function(){
			var turn=new Turn();
			var c5=new Card(Suits.spades,3);
			turn.addPlay({player:p1,card:c5});
			var c6=new Card(Suits.spades,2);
			var c7=new Card(Suits.spades,5);
			var c8=new Card(Suits.spades,6);
			var c9=new Card(Suits.spades,7);
			var playersHand=p.packWith([c6,c7,c8,c9]);
			var expectedThrowable=p.packWith([c7,c8,c9]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
		it("only lower trump can be played if running suit is trump and higher trump is unavailable",function(){
			var turn=new Turn();
			var c5=new Card(Suits.spades,3);
			turn.addPlay({player:p1,card:c5});
			var c6=new Card(Suits.spades,2);
			var playersHand=p.packWith([c1,c2,c3,c6]);
			var expectedThrowable=p.packWith([c6]);
			var throwable=turn.throwableCardsIn(playersHand);
			expect(throwable).to.eql(expectedThrowable);
		});
	}); 
});
	
