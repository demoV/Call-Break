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