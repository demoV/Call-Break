var chai = require('chai');
var assert  = chai.assert;
var expect = chai.expect;
var entities = require('../entities.js').entities;

describe('Card',function(){
	var sampleCard = new entities.Card('diamond' , 14 );
	it('should be a constructor which creates properties in a new object',function(){
		expect(sampleCard).to.be.a('object');
		expect(sampleCard).to.be.an.instanceof(entities.Card);
	});
	it('should have properties suit and rank',function(){
		expect(sampleCard).to.have.all.keys('suit','rank');
		expect(sampleCard.suit).to.be.equal('diamond');
		expect(sampleCard.rank).to.be.equal(14);
	});
	it('should be construct a card equal to its name',function(){
		assert.equal('ace_of_diamond',sampleCard);
	})
});