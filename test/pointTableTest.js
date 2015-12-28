var PointTable = require('../lib/pointTable.js');
var dataFile = './data/pointTable.json';
var fs = require('fs');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var players = {
	A: {
		round : {call : 3, capturedHands : 3}
    },
	B: {
		round : {call : 5, capturedHands : 4}
	},
	C: {
		round : {call : 2, capturedHands : 3}
	},
	D: {
        round : {call : 4, capturedHands : 3}
	}
};

describe('PointTable',function(){
    var pointTableData = {};
    var pointTable;
    beforeEach(function(){
        pointTable = new PointTable();
    });
    describe('update pointTable',function(){
        it('should update/save points of all players of specified round',function(){
            var update = function(players,previousData){
                players.A.round.score = 3;
                players.B.round.score = -5;
                players.C.round.score = 2;
                players.D.round.score = 4;
                pointTableData['round1'] ={
                    A:players.A.round,
                    B:players.B.round,
                    C:players.C.round,
                    D:players.D.round
                };
            }
            pointTable.updatePointTableOf = sinon.stub(update(players,pointTableData));
            var expectedPointTable = {
                round1:{
                    A:{call:3,capturedHands:3,score:3},
                    B:{call:5,capturedHands:4,score:-5},
                    C:{call:2,capturedHands:3,score:2},
                    D:{call:4,capturedHands:3,score:4}
                }
            }
            pointTable.getPointTable = sinon.stub().returns(pointTableData);
            expect(pointTable.getPointTable()).to.eql(expectedPointTable);
        });
    });
    describe('show winner',function(){
        it('should tell who is the winner of the round',function(){
            var PlayersData = {
                round1:{
                    A:{call:3,capturedHands:4,score:3},
                    B:{call:4,capturedHands:3,score:-3},
                    C:{call:2,capturedHands:3,score:2},
                    D:{call:4,capturedHands:3,score:-4}
                }
            }
            expect(pointTable.showWinner(PlayersData)).to.eql({winnerName:'A'});
        });
    });
});