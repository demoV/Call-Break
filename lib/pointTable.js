var ld = require('lodash');
var fs = require('fs');
var finalRepresentationOf = require('./representPointTable.js');

var pointTableFile = './data/pointTable.json';
var pointTableFileData = fs.existsSync(pointTableFile) && JSON.parse(fs.readFileSync(pointTableFile,'utf8')) || {};



var PointTable = function(){
    this.NoOfRounds = 5;
};

PointTable.prototype = {
    countScore : function(currentRound,playerName){
        var playerData = currentRound[playerName];
        return (playerData.call - playerData.captured) > 0 ? playerData['score'] = -playerData.call :
        playerData['score'] = playerData.call;
    },
    currentRoundPoints : function(players){
        var self = this;
        return Object.keys(players).reduce(function(currentRoundData,playerName){
            currentRoundData[playerName] = players[playerName]['round'];
            currentRoundData[playerName]['score'] = self.countScore(currentRoundData,playerName);
            return currentRoundData;
        },{});
    },
    addDataInFile : function(roundPoint,previousPointsData){
        var completedRounds = Object.keys(previousPointsData);
        var totalRounds = completedRounds.length;
        previousPointsData['round'+(completedRounds.length+1)] = roundPoint;
        fs.writeFileSync(pointTableFile, JSON.stringify(previousPointsData));
    },
    updatePointTableOf : function(players){
        var previousPointsData = fs.existsSync(pointTableFile) && JSON.parse(fs.readFileSync(pointTableFile,'utf8')) || {};
        if(Object.keys(previousPointsData).length < this.NoOfRounds){
           var roundPoint = this.currentRoundPoints(players);
            this.addDataInFile(roundPoint,previousPointsData);
        };
    },
    showWinner : function(pointTable){
        var pointTable = JSON.parse(fs.readFileSync(pointTableFile,'utf-8'));
        var allRounds = Object.keys(pointTable);
        var playersName = Object.keys(pointTable.round1);
        var playerTotalPoints = {};
    	playersName.reduce(function(playerTotalPoints,eachPlayer){
            playerTotalPoints[eachPlayer] = allRounds.reduce(function(currentRound,nextRound){
                return currentRound + pointTable[nextRound][eachPlayer].score
            },0);
    		return playerTotalPoints;
    	},playerTotalPoints);
        return {winnerName : Object.keys(playerTotalPoints).sort(function(p1,p2){
            return playerTotalPoints[p2] - playerTotalPoints[p1]}).shift()};
    },
    deletePreviousPointTable : function(){
        if(fs.existsSync(pointTableFile))
            fs.unlinkSync(pointTableFile);
    },
    getPointTable : function(){
        var pointTableData =  JSON.parse(fs.readFileSync(pointTableFile,'utf-8'));
        return finalRepresentationOf(pointTableData);
    }
};

var p = new PointTable();
p.updatePointTableOf();
module.exports = PointTable;
