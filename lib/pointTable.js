var ld = require('lodash');
var fs = require('fs');
//var finalRepresentationOf = require('./representPointTable.js');
var pointTableFile = './data/pointTable.json';


var PointTable = function(){
    this.noOfTotalRounds = 5;
    this.noOfPlayedRounds = 0;
};

PointTable.prototype = {
    readPointTable : function(){
        return fs.existsSync(pointTableFile) && JSON.parse(fs.readFileSync(pointTableFile,'utf8')) || {};
    },
    countScore : function(playerData){
        return (playerData.call - playerData.captured) > 0 ? (-playerData.call) : playerData.call;
    },
    currentRoundPoints : function(players){
        var self = this;
        if(!players)
            return "";
        return Object.keys(players).reduce(function(currentRoundData,playerName){
            var score = self.countScore(players[playerName]['round']);
            currentRoundData[playerName] = score;
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
        previousPointsData = this.readPointTable();
        if(this.noOfPlayedRounds < this.noOfTotalRounds){
           var roundPoint = this.currentRoundPoints(players);
            this.addDataInFile(roundPoint,previousPointsData);
            this.noOfPlayedRounds++;
        };
    },
    showWinner : function(){
        var playersTotalPoints = this.totalScore();
        return {winnerName : Object.keys(playersTotalPoints).sort(function(p1,p2){
            return playersTotalPoints[p2] - playersTotalPoints[p1]}).shift()};
    },
    deletePreviousPointTable : function(){
        if(fs.existsSync(pointTableFile))
            fs.unlinkSync(pointTableFile);
    },
    getPointTable : function(){
        var pointTableData =  this.readPointTable();
        var totalScoreOfCompletedRounds = this.totalScore();
        pointTableData['total'] = totalScoreOfCompletedRounds;
        return pointTableData;
//        return finalRepresentationOf(pointTableData,totalScoreOfCompletedRounds);
    },
    totalScore : function(){
         var pointTable = this.readPointTable();
        var allRounds = Object.keys(pointTable);
        if(allRounds.length == 0 ){return {}}
        var playersName = Object.keys(pointTable.round1);
        return playersName.reduce(function(playersTotalPoints,eachPlayerScore){
            playersTotalPoints[eachPlayerScore] = allRounds.reduce(function(currentRound,nextRound){
                return currentRound + pointTable[nextRound][eachPlayerScore];
            },0);
            return playersTotalPoints;
        },{});
    }
};


module.exports = PointTable;