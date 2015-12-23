var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var lib = require('../lib/card.js').lib;

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

