var entities = require('../javascript/player.js').entities;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Player', function(){
	var Player = entities.Player;
	var player = new Player();
	it('should instanseof Player', function(){
		expect(Player).to.exist;
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
	it('should not configurable for name and hands property', function(){
		var demo = new Player('demo');
		delete demo.name;
		delete demo.hands;
		expect(demo).to.have.property('name');	
		expect(demo).to.have.property('hands');	
	});
	it('can throw a card of given name', function(){
		var demo = new Player('demo');
		demo.hands.diamonds.push({suit: 'diamonds', rank: 4, toString: function(){return 'four_of_diamonds';}});
		var thrownCard = demo.throwCard('four_of_diamonds');
		expect(demo.hands.diamonds).to.have.length(0);
		expect(thrownCard[0]).to.have.all.keys(['suit', 'rank', 'toString']);
		expect(thrownCard[0]).to.have.property('suit', 'diamonds').that.is.a('string');
		expect(thrownCard[0]).to.have.property('rank', 4).that.is.a('number');
	});
	it('should have prototype throwCard', function(){
		expect(player).to.respondTo('throwCard');
	});
});