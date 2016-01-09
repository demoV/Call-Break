var PointTable = require('../lib/pointTable.js');
var expect = require('chai').expect;
var sinon = require('sinon');

var players = {
    A:{round: {call : 3, captured : 3}},
    B:{round: {call : 5, captured : 4}},
    C:{round: {call : 2, captured : 3}},
    D:{round: {call : 4, captured : 3}}
};

describe('PointTable',function(){
    var pointTableData = {};
    var pointTable = new PointTable();
    beforeEach(function(){
        pointTable = new PointTable();
    });
    describe('count Score',function(){
        it('should count the score of first player',function(){
            expect(pointTable.countScore(players.A.round)).to.equal(3);
        });
        it('should count the score of second player',function(){
            expect(pointTable.countScore(players.B.round)).to.equal(-5);
        });
        it('should count the score of third player',function(){
            expect(pointTable.countScore(players.C.round)).to.equal(2);
        });
        it('should count the score of fourth player',function(){
            expect(pointTable.countScore(players.D.round)).to.equal(-4);
        });
    });
    describe('currentRoundPoints',function(){
       it('should give the score of specified round of all four players',function(){
           expect(pointTable.currentRoundPoints(players)).to.eql({ A: 3,B: -5,C: 2,D: -4});
       });
    });
    describe('showWinner',function(){
       it('should give the name of the winner',function(){
           pointTable.readPointTable = sinon.stub().returns({round1:{ A: 3,B: -5,C: 4,D: -4},round2:{ A: 3,B: -5,C: 5,D: -4}});
           expect(pointTable.showWinner()).to.eql({winnerName:'C'});
       });
    });
    describe('getPointTable',function(){
        it('should give me the data of all players of single round with total Points of all players',function(){
           var  readPointTableOutput = {round1:{ A: 3,B: -5,C: 2,D: -4}};
            pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
           var expectedResult = { round1: { A: 3, B: -5, C: 2, D: -4 },
                             total: { A: 3, B: -5, C: 2, D: -4 } }
           expect(pointTable.getPointTable()).to.eql(expectedResult);
        });
        it('should give me the data of all players of two rounds with total Points of all players',function(){
           var  readPointTableOutput = {round1:{ A: 3,B: -5,C: 2,D: -4},
                                         round2:{ A: -2,B: 5,C: 4,D: 3}};
            pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
           var expectedResult = {round1: { A: 3, B: -5, C: 2, D: -4 },
                             round2: { A: -2, B: 5, C: 4, D: 3 },
                             total: { A: 1, B: 0, C: 6, D: -1 } };
           expect(pointTable.getPointTable()).to.eql(expectedResult);
        });
        it('should give me the data of all players of three rounds with total Points of all players',function(){
            var  readPointTableOutput = {round1:{ A: 3,B: -5,C: 2,D: -4},
                                         round2:{ A: -2,B: 5,C: 4,D: 3},
                                         round3:{ A: 2,B: 2,C: 4,D: 5}};
            pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
            var expectedResult = {round1: { A: 3, B: -5, C: 2, D: -4 },
                                  round2: { A: -2, B: 5, C: 4, D: 3 },
                                  round3: { A: 2, B: 2, C: 4, D: 5 },
                                  total: { A: 3, B: 2, C: 10, D: 4}};
            expect(pointTable.getPointTable()).to.eql(expectedResult);
        });
        it('should give me the data of all players of four rounds with total Points of all players',function(){
            var  readPointTableOutput = {round1:{ A: 3,B: -5,C: 2,D: -4},
                                         round2:{ A: -2,B: 5,C: 4,D: 3},
                                         round3:{ A: 2,B: 2,C: 4,D: 5},
                                        round4:{ A: 6,B: 3,C: -3,D: 3}};
            pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
            var expectedResult = {round1: { A: 3, B: -5, C: 2, D: -4 },
                                  round2: { A: -2, B: 5, C: 4, D: 3 },
                                  round3: { A: 2, B: 2, C: 4, D: 5 },
                                  round4:{ A: 6,B: 3,C: -3,D: 3},
                                  total: { A: 9, B: 5, C: 7, D: 7}};
            expect(pointTable.getPointTable()).to.eql(expectedResult);
        });
    it('should give me the data of all players of five rounds with total Points of all players',function(){
            var  readPointTableOutput = {round1:{ A: 3,B: -5,C: 2,D: -4},
                                         round2:{ A: -2,B: 5,C: 4,D: 3},
                                         round3:{ A: 2,B: 2,C: 4,D: 5},
                                        round4:{ A: 6,B: 3,C: -3,D: 3},
                                        round5:{ A: -2,B: 2,C: 5,D: 4}};
            pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
            var expectedResult = {round1: { A: 3, B: -5, C: 2, D: -4 },
                                  round2: { A: -2, B: 5, C: 4, D: 3 },
                                  round3: { A: 2, B: 2, C: 4, D: 5 },
                                  round4:{ A: 6,B: 3,C: -3,D: 3},
                                  round5:{ A: -2,B: 2,C: 5,D: 4},
                                  total: { A: 7, B: 7, C: 12, D: 11}};
            expect(pointTable.getPointTable()).to.eql(expectedResult);
        });
    });
    describe('totalScore',function(){
       it('should give me the total of all round score of each player',function(){
           var  readPointTableOutput = {};
           pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
           expect(pointTable.totalScore()).to.eql({});
       });
    });
    describe('totalScore',function(){
       it('should give me the total of all round score of each player',function(){
           var  readPointTableOutput = {round1:{ A: 3,B: -5,C: 2,D: -4},
                                        round2:{ A: -2,B: 5,C: 4,D: 3},
                                        round3:{ A: 2,B: 2,C: 4,D: 5},
                                        round4:{ A: 6,B: 3,C: -3,D: 3},
                                        round5:{ A: -2,B: 2,C: 5,D: 4}};
           pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
           expect(pointTable.totalScore()).to.eql({ A: 7, B: 7, C: 12, D: 11});
       });
    });
    describe('updatePointTableof',function(){
        it('should update the pointTable and increment the no of round played',function(){
           var  readPointTableOutput = {};
           pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
           pointTable.addDataInFile = sinon.stub();
           pointTable.updatePointTableOf(players);
           expect(pointTable.noOfPlayedRounds).to.equal(1);
        });
        it('should update the pointTable and increment the no of round played when update called 5 times',function(){
           var  readPointTableOutput = {};
           pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
            pointTable.addDataInFile = sinon.stub();
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
           expect(pointTable.noOfPlayedRounds).to.equal(5);
        });
        it('should not update the pointTable and not increment the no of round played when update called above 5 times',function(){
           var  readPointTableOutput = {};
           pointTable.readPointTable = sinon.stub().returns(readPointTableOutput);
            pointTable.addDataInFile = sinon.stub();
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
            pointTable.updatePointTableOf(players);
           expect(pointTable.noOfPlayedRounds).to.not.equal(6);
        });
    });
}); 
