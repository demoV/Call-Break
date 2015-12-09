var callBreak = require('../javascript/callBreak.js');
var chai = require('chai');
var expect = chai.expect;

var hand = { diamonds: 
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
     { suit: 'spades', rank: 7 } ] };

var handsWithoutLedSuitAndSpades = { diamonds: 
   [ { suit: 'diamonds', rank: 4 },
     { suit: 'diamonds', rank: 10 } ],
    clubs: 
   [ { suit: 'clubs', rank: 10 },
     { suit: 'clubs', rank: 9 },
     { suit: 'clubs', rank: 11 } ],
     hearts: [],
     spades: []
  	};
var handsWithoutLedSuit = { diamonds: 
   [],
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
     { suit: 'spades', rank: 7 } ] };
describe('throwableCards' , function(){
	var game = new callBreak.CreateGame(['lakha' , 'bhura' , 'champu' , 'sakaal'],distributor);
	beforeEach(function(){
		game.deck.thrownCards = [];
		game.players['bhura'].hands = {};
	})
	it('gives greater rank Cards of led suit', function(){
		game.deck.thrownCards.push({card: {rank: 8, suit: 'diamonds'}, playerId: 'champu'});
		game.players['bhura'].hands = hand;
		expect(game.throwableCards('bhura')).to.eql([{ suit: 'diamonds', rank: 10 }]);
	});
	it('gives cards of led suit', function(){
		game.deck.thrownCards.push({card: {rank: 3, suit: 'diamonds'}, playerId: 'champu'});
		game.players['bhura'].hands = hand;
		expect(game.throwableCards('bhura')).to.eql([{ suit: 'diamonds', rank: 4 },{ suit: 'diamonds', rank: 10 }]);
	});
	it('gives all spades cards if player do not have led suit card', function(){
		game.players['bhura'].hands = handsWithoutLedSuit;
		game.deck.thrownCards.push({card: {rank: 8, suit: 'diamonds'}, playerId: 'champu'},
									{card: {rank: 12, suit: 'diamonds'}, playerId: 'sakaal'});
		expect(game.throwableCards('bhura')).to.eql([ { suit: 'spades', rank: 4 },
     												  { suit: 'spades', rank: 13 },
     												  { suit: 'spades', rank: 14 },
     												  { suit: 'spades', rank: 8 },
     												  { suit: 'spades', rank: 7 } ]);

	});
	it('gives greater rank of spades cards if deck have highest card of spades', function(){
		game.players['bhura'].hands = handsWithoutLedSuit;
		game.deck.thrownCards.push({card: {rank: 8, suit: 'diamonds'}, playerId: 'champu'},
									{card: {rank: 12, suit: 'diamonds'}, playerId: 'sakaal'},
									{card: {rank: 7, suit: 'spades'}, playerId: 'lakha'});
		expect(game.throwableCards('bhura')).to.eql([ { suit: 'spades', rank: 13 },
     												  { suit: 'spades', rank: 14 },
     												  { suit: 'spades', rank: 8 } ]);		
	});
	it('gives all cards if it is first turn', function(){
		game.players['bhura'].hands = hand;
		expect(game.throwableCards('bhura')).to.eql( [{ suit: 'diamonds', rank: 4 },
    												{ suit: 'diamonds', rank: 10 },
    												{ suit: 'hearts', rank: 11 },
												     { suit: 'hearts', rank: 14 },
												     { suit: 'hearts', rank: 8 },
												     { suit: 'clubs', rank: 10 },
												     { suit: 'clubs', rank: 9 },
												     { suit: 'clubs', rank: 11 },
												     { suit: 'spades', rank: 4 },
												     { suit: 'spades', rank: 13 },
												     { suit: 'spades', rank: 14 },
												     { suit: 'spades', rank: 8 },
												     { suit: 'spades', rank: 7 }] );
	});
	it('gives all cards if player do not have led cards and spades cardds', function(){
		game.players['bhura'].hands = handsWithoutLedSuitAndSpades;
		game.deck.thrownCards.push({card: {rank: 8, suit: 'hearts'}, playerId: 'champu'});
		expect(game.throwableCards('bhura')).to.eql([ { suit: 'diamonds', rank: 4 },
     												{ suit: 'diamonds', rank: 10 },
     												{ suit: 'clubs', rank: 10 },
     												{ suit: 'clubs', rank: 9 },
     												{ suit: 'clubs', rank: 11 } ]);
	});
});