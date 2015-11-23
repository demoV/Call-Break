var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var lib = require('./card.js').lib;

describe('Card', function(){
	var sampleCard = new lib.Card('diamonds' , 14 );
	it('should be a constructor which creates properties in a new object', function(){
		expect(sampleCard).to.be.a('object');
		expect(sampleCard).to.be.an.instanceof(lib.Card);
	});
	it('should have properties suit and rank', function(){
		expect(sampleCard).to.have.all.keys('suit', 'rank');
		expect(sampleCard.suit).to.be.equal('diamonds');
		expect(sampleCard.rank).to.be.equal(14);
	});
	it('should be construct a card equal to its name', function(){
		assert.equal('ace_of_diamonds',sampleCard.toString());
	});
	it('should construct a card which is not changable', function(){
		sampleCard.suit = 'hearts';
		sampleCard.rank = 4;
		expect(sampleCard.suit).to.be.equal('diamonds');
		expect(sampleCard.rank).to.be.equal(14);
		assert.equal(sampleCard , 'ace_of_diamonds');
		assert.notEqual(sampleCard , 'four_of_hearts');
	});
});

describe('generatePack', function(){
	var pack = lib.generatePack();
	it('should be generate an array of cards', function(){
		expect(pack).to.be.a('array');
	});
	it('should have length 52', function(){
		expect(pack).to.have.length(52);
	});
	it('should have 13 cards of each suit', function(){
		describe('diamond cards', function(){
			var diamondCards = pack.filter(function(card){
				return card.suit == 'diamonds';
			});
			it('should have length 13', function(){
				expect(diamondCards).to.have.length(13);
			});
			it('should be an object with properties suit and rank', function(){
				diamondCards.forEach(function(card){
					expect(card).to.be.an('object').to.have.all.keys('suit', 'rank')
				});
			})
			it('should have cards two to ace', function(){
				var rank_of_diamondCards = diamondCards.map(function(card){
					return card.rank;
				});
				var expected = [2,3,4,5,6,7,8,9,10,11,12,13,14];
				expect(rank_of_diamondCards).to.be.deep.equal(expected);
			})
		});
		describe('club cards', function(){
			var clubCards = pack.filter(function(card){
				return card.suit == 'clubs';
			});
			it('should have length 13', function(){
				expect(clubCards).to.have.length(13);
			});
			it('should be an object with properties suit and rank', function(){
				clubCards.forEach(function(card){
					expect(card).to.be.an('object').to.have.all.keys('suit', 'rank')
				});
			})
			it('should have cards two to ace', function(){
				var rank_of_clubCards = clubCards.map(function(card){
					return card.rank;
				});
				var expected = [2,3,4,5,6,7,8,9,10,11,12,13,14];
				expect(rank_of_clubCards).to.be.deep.equal(expected);
			})
		});
		describe('heart cards', function(){
			var heartCards = pack.filter(function(card){
				return card.suit == 'hearts';
			});
			it('should have length 13', function(){
				expect(heartCards).to.have.length(13);
			});
			it('should be an object with properties suit and rank', function(){
				heartCards.forEach(function(card){
					expect(card).to.be.an('object').to.have.all.keys('suit', 'rank')
				});
			})
			it('should have cards two to ace', function(){
				var rank_of_heartCards = heartCards.map(function(card){
					return card.rank;
				});
				var expected = [2,3,4,5,6,7,8,9,10,11,12,13,14];
				expect(rank_of_heartCards).to.be.deep.equal(expected);
			})
		});
		describe('spade cards', function(){
			var spadeCards = pack.filter(function(card){
				return card.suit == 'diamonds';
			});
			it('should have length 13', function(){
				expect(spadeCards).to.have.length(13);
			});
			it('should be an object with properties suit and rank', function(){
				spadeCards.forEach(function(card){
					expect(card).to.be.an('object').to.have.all.keys('suit', 'rank')
				});
			})
			it('should have cards two to ace', function(){
				var rank_of_spadeCards = spadeCards.map(function(card){
					return card.rank;
				});
				var expected = [2,3,4,5,6,7,8,9,10,11,12,13,14];
				expect(rank_of_spadeCards).to.be.deep.equal(expected);
			});
		});
	});
});