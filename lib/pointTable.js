var ld = require('lodash');
var fs = require('fs');

var pointTableFile = './data/pointTable.json';
var pointTableFileData = fs.existsSync(pointTableFile) && JSON.parse(fs.readFileSync(pointTableFile,'utf8')) || {};

var PointTable = function(){};

var countScore = function(currentRound,playerName){
    var playerData = currentRound[playerName];
    return (playerData.call - playerData.capturedHands) > 0 ? playerData['score'] = -playerData.call :
    playerData['score'] = playerData.call;
};

var currentRoundPoints = function(players){
    return Object.keys(players).reduce(function(currentRoundData,playerName){
        currentRoundData[playerName] = players[playerName]['round'];
        currentRoundData[playerName]['score'] = countScore(currentRoundData,playerName);
        return currentRoundData;
    },{});
};

var addDataInFile = function(roundPoint,previousPointsData){
//    var previousPointsData = fs.existsSync(pointTableFile) && JSON.parse(fs.readFileSync(pointTableFile,'utf8')) || {};
    var completedRounds = Object.keys(previousPointsData);
    var totalRounds = completedRounds.length;
    previousPointsData['round'+(completedRounds.length+1)] = roundPoint;
    fs.writeFileSync('./data/pointTable.json', JSON.stringify(previousPointsData));
}

PointTable.prototype = {
    updatePointTableOf : function(players,previousPointsData){
        if(Object.keys(pointTableFileData).length < 5){
           var roundPoint = currentRoundPoints(players);
            addDataInFile(roundPoint,previousPointsData);
        };
    },
    showWinner : function(pointTable){
//        var pointTable = JSON.parse(fs.readFileSync('./data/pointTable.json','utf-8'));
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
        if(fs.existsSync('./data/pointTable.json'))
            fs.unlinkSync('./data/pointTable.json');
    },
    getPointTable : function(){
        return JSON.parse(fs.readFileSync(pointTableFile,'utf-8'));
    }
}

//var players = {
//    akshay:{name:'akshay',
//       round:{call:3,capturedHands:3}
//       },
//    lalit:{name:'lalit',
//       round:{call:2,capturedHands:2}
//       },
//    adarsh:{name:'adarsh',
//       round:{call:3,capturedHands:2}
//       },
//    vinay:{name:'vinay',
//       round:{call:4,capturedHands:1}
//       }
//};
//
//var players2 = {
//    adarsh:{name:'adarsh',
//       round:{call:3,capturedHands:2}
//       },
//    lalit:{name:'lalit',
//       round:{call:6,capturedHands:7}
//       },
//    akshay:{name:'akshay',
//       round:{call:3,capturedHands:3}
//       },
//    vinay:{name:'vinay',
//       round:{call:4,capturedHands:1}
//       }
//};

//var players = {
//	A: {
//		name : 'A',
//		round : {call : 3, capturedHands : 3}
//    },
//	B: {
//        name : 'B',
//		round : {call : 5, capturedHands : 4}
//	},
//	C: {
//        name : 'C',
//		round : {call : 2, capturedHands : 3}
//	},
//	D: {
//		name : 'D',
//        round : {call : 4, capturedHands : 3}
//	}
//};
//
//var pointTable = new PointTable();
//pointTable.updatePointTableOf(players);

module.exports = PointTable;