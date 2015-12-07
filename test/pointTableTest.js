var entities = require('../javascript/pointTable.js');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var players = {
	akshay: {
		name : 'akshay',
		round : {
			call : 3,
			capturedHands : 3
		}
	},
	lalit: {
		name : 'lalit',
		round : {
			call : 5,
			capturedHands : 4	
		}
	},
	adarsh: {
		name : 'adarsh',
		round : {
			call : 2,
			capturedHands : 3	
		}
	},
	durga: {
		name : 'durga',
		round : {
			call : 4,
			capturedHands : 3	
		}
	}
};
describe('currentRoundPoints',function(){
	var pointTable = entities.currentRoundPoints();
	afterEach(function() {
		pointTable = entities.currentRoundPoints();
	});
	it('should exists',function(){
		expect(entities.currentRoundPoints).to.exist;
	});
	it('should return a function',function(){
		expect(entities.currentRoundPoints()).instanceof(Function);
	});

	describe('pointTable',function(){
		it('should return an object',function(){
			expect(pointTable(players)).instanceof(Object);
		});
		it('should contain keys (round1,round2,round3)',function(){
			pointTable(players);
			pointTable(players);
			expect(pointTable(players)).to.have.all.keys('round1','round2','round3');
		});
		it('should give "all round completed" message when 5 round are over',function(){
			pointTable(players);
			pointTable(players);
			pointTable(players);
			pointTable(players);
			pointTable(players);
			expect(pointTable(players)).to.be.equal('All Rounds Completed');
		});
		describe('Every round',function(){
			it('should contain keys of players name',function(){
				expect(pointTable(players).round1).to.have.all.keys('akshay','lalit','durga','adarsh');
			});
			it('object keys should contain three keys(call and capturedHands,score)',function(){
				expect(pointTable(players).round1.akshay).to.have.all.keys('call','capturedHands','score');
			});
			it('score key should contain lesser than or equal score to the capturedHands of each player object',function(){
				expect(pointTable(players).round1.durga.score).to.be.below(pointTable(players).round1.durga.capturedHands);
			});
			it('call key should be greater than 1',function(){
				expect(pointTable(players).round1.adarsh.call).to.have.at.least(2);
			});
			it('call key should be smaller than 9',function(){
				expect(pointTable(players).round1.lalit.call).to.have.at.most(8);
			});
		});
	});
});

