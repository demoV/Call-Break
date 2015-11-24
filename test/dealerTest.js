var chai = require('chai');
var entities = require('../javascript/dealer.js').entities;
var assert = chai.assert;
var expect = chai.expect;

describe('"dealer', function(){
	var cards = [ { suit: 'clubs', rank: 11 },
					  { suit: 'heart', rank: 5 },
					  { suit: 'heart', rank: 8 },
					  { suit: 'clubs', rank: 14 },
					  { suit: 'diamond', rank: 9 },
					  { suit: 'heart', rank: 12 },
					  { suit: 'heart', rank: 6 },
					  { suit: 'spades', rank: 4 },
					  { suit: 'diamond', rank: 3 },
					  { suit: 'spades', rank: 7 },
					  { suit: 'clubs', rank: 13 },
					  { suit: 'diamond', rank: 11 },
					  { suit: 'diamond', rank: 14 },
					  { suit: 'diamond', rank: 10 },
					  { suit: 'spades', rank: 2 },
					  { suit: 'heart', rank: 7 },
					  { suit: 'diamond', rank: 6 },
					  { suit: 'heart', rank: 14 },
					  { suit: 'diamond', rank: 7 },
					  { suit: 'spades', rank: 14 },
					  { suit: 'diamond', rank: 4 },
					  { suit: 'heart', rank: 9 },
					  { suit: 'diamond', rank: 13 },
					  { suit: 'heart', rank: 4 },
					  { suit: 'clubs', rank: 7 },
					  { suit: 'clubs', rank: 12 },
					  { suit: 'clubs', rank: 6 },
					  { suit: 'clubs', rank: 3 },
					  { suit: 'diamond', rank: 8 },
					  { suit: 'clubs', rank: 4 },
					  { suit: 'clubs', rank: 10 },
					  { suit: 'spades', rank: 9 },
					  { suit: 'diamond', rank: 2 },
					  { suit: 'clubs', rank: 5 },
					  { suit: 'clubs', rank: 2 },
					  { suit: 'spades', rank: 5 },
					  { suit: 'diamond', rank: 12 },
					  { suit: 'heart', rank: 2 },
					  { suit: 'heart', rank: 11 },
					  { suit: 'clubs', rank: 9 },
					  { suit: 'spades', rank: 12 },
					  { suit: 'spades', rank: 6 },
					  { suit: 'heart', rank: 13 },
					  { suit: 'diamond', rank: 5 },
					  { suit: 'spades', rank: 13 },
					  { suit: 'spades', rank: 8 },
					  { suit: 'spades', rank: 11 },
					  { suit: 'heart', rank: 3 },
					  { suit: 'spades', rank: 10 },
					  { suit: 'spades', rank: 3 },
					  { suit: 'clubs', rank: 8 },
					  { suit: 'heart', rank: 10 } ]
	var players = {p1:{name:'akshay',hands:{diamond:[],clubs:[],heart:[],spades:[]}},
				   p2:{name:'lalit',hands:{diamond:[],clubs:[],heart:[],spades:[]}},
				   p3:{name:'durga',hands:{diamond:[],clubs:[],heart:[],spades:[]}},
				   p4:{name:'vinay',hands:{diamond:[],clubs:[],heart:[],spades:[]}}};
	describe('shuffle"', function(){
		it('checks the length of shuffled cards',function(){
			expect(entities.dealer.shuffle(cards)).to.be.instanceof(Array).with.length(52);
		});
	});
	describe('distribute"', function(){
		it('checks the length of hands of each player after distribution', function(){
			expect(entities.dealer.distribute).to.exist;
			var distribute = entities.dealer.distribute;
			distribute(players,cards)
			expect(players.p1.hands).include.keys('diamond','clubs','heart','spades');
			expect(players.p2.hands).include.keys('diamond','clubs','heart','spades');
			expect(players.p3.hands).include.keys('diamond','clubs','heart','spades');
			expect(players.p4.hands).include.keys('diamond','clubs','heart','spades');
		});
		it('checks the names of each player after distribution', function(){
			expect(players.p1.name).to.be.a('string').to.be.equal('akshay');
			expect(players.p2.name).to.be.a('string').to.be.equal('lalit');
			expect(players.p3.name).to.be.a('string').to.be.equal('durga');
			expect(players.p4.name).to.be.a('string').to.be.equal('vinay');
		});
	});
	describe('writeCall"',function(){
		var writeCall = entities.dealer.writeCall;
		writeCall(players,'p1',3);
		writeCall(players,'p4',5);
		it('checks the existance of the function',function(){
			expect(entities.dealer.writeCall).to.exist;
		});
		it('will check call made by player is valid or not',function(){
			expect(players.p1.call).to.be.ok;
		})
		it('writes the call made by each player', function(){
			expect(players.p1.call).to.equal(3);
			expect(players.p4.call).to.equal(5);
		});
	});
});

















