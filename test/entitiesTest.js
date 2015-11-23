var entities = require('../entities.js').entities;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Player', function(){
	var Player = entities.Player;
	var player = new Player();
	it('should instanseof Player', function(){
		expect(player).to.be.an.instanceof(Player);
	});
	it('should have 2 properties name and hands', function(){
		expect(player).to.contain.all.keys(['name', 'hands']);
	});
	it('is not writable for name property', function(){
		var demo = new Player('demo');
		demo.name = 'Charlee';
		expect(demo.name).to.eql('demo');
		expect(demo.name).to.not.eql('Charlee');
	});
	it('should not configurable for name property', function(){
		var demo = new Player('demo');
		delete demo.name;
		expect(demo).to.have.property('name');	
	});
})

describe('Card', function(){
	var sampleCard = new entities.Card('diamond' , 14 );
	it('should be a constructor which creates properties in a new object', function(){
		expect(sampleCard).to.be.a('object');
		expect(sampleCard).to.be.an.instanceof(entities.Card);
	});
	it('should have properties suit and rank', function(){
		expect(sampleCard).to.have.all.keys('suit', 'rank');
		expect(sampleCard.suit).to.be.equal('diamond');
		expect(sampleCard.rank).to.be.equal(14);
	});
	it('should be construct a card equal to its name', function(){
		assert.equal('ace_of_diamond',sampleCard);
	});
});

describe('generatePack', function(){
	var pack = entities.generatePack();
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
			})
		});
	});
});
