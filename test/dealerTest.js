var chai = require('chai');
var entities = require('../javascript/dealer.js').entities;
var Player = require('../javascript/player.js').entities.Player;
var pack = require('../javascript/card.js').lib.generatePack();
var assert = chai.assert;
var expect = chai.expect;

var players = {	p1:new Player('akshay'),
			   	p2: new Player('lalit'),
			   	p3: new Player('durga'),
			   	p4: new Player('vinay')
			};
describe('shuffle"', function(){
	it('checks the length of shuffled cards',function(){
		expect(entities.dealer.shuffle(pack)).to.be.instanceof(Array).with.length(52);
	});
});
describe('distribute"', function(){
	it('checks all suit keys in hands of each player are present or not', function(){
		expect(entities.dealer.distribute).to.exist;
		var distribute = entities.dealer.distribute;
		distribute(players,pack)
		expect(players.p1.hands).include.keys('diamonds','clubs','hearts','spades');
		expect(players.p2.hands).include.keys('diamonds','clubs','hearts','spades');
		expect(players.p3.hands).include.keys('diamonds','clubs','hearts','spades');
		expect(players.p4.hands).include.keys('diamonds','clubs','hearts','spades');
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


















