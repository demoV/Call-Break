var ld = require('lodash');
var fs = require('fs');
var tableRepresentation = require('./representPointTable.js');

var  pointTableFile = './data/pointTable.json';

var countScore = function(currentRound){
	Object.keys(currentRound).forEach(function(playerName){
		playerData = currentRound[playerName];
		(playerData.call - playerData.capturedHands) > 0 ? playerData['score'] = -playerData.call :
			playerData['score'] = playerData.call;
	});
};

exports.currentRoundPoints = function(){
	var allRounds = {round1:1,round2:1,round3:1,round4:1,round5:1};
	var roundNumber = 0;
	return function(players){
		roundNumber++;
		if(allRounds['round'+roundNumber]){
			allRounds['round'+roundNumber] = ld.zipObject(Object.keys(players).map(function(playerName){
				return [players[playerName].name,players[playerName].round];
			}));
			var currentRound = allRounds['round'+roundNumber];
			countScore(currentRound);
			return ld.omit(allRounds,ld.isNumber);
		}
		else{
			return findWinner();
		}
	};
};

var eachRoundData = exports.currentRoundPoints();

exports.save = function(entry){
	var roundPoint = eachRoundData(entry);
	if(roundPoint.winnerName){
		var previousPointsData = JSON.parse(fs.readFileSync(pointTableFile,'utf8'))[0];
		previousPointsData.winnerName = roundPoint.winnerName;
		roundPoint = previousPointsData;
	}
	fs.writeFileSync(pointTableFile, JSON.stringify([roundPoint]));	
};

var findWinner = function(){
	var pointTable = fs.existsSync(pointTableFile) && JSON.parse(fs.readFileSync(pointTableFile, 'utf8'))[0];
	var allRounds = Object.keys(pointTable);
	var playersName = Object.keys(pointTable.round1);
	var positions = {};
	playersName.reduce(function(positions,eachPlayer){
		positions[eachPlayer] = 0;
		return positions;
	},positions);
	allRounds.forEach(function(eachRound){
		playersName.forEach(function(eachPlayer){
			positions[eachPlayer] += pointTable[eachRound][eachPlayer].score;
		});
	});
	return {winnerName : Object.keys(positions).sort(function(firstplayer,secondPlayer){
	 return positions.firstplayer - positions.secondPlayer}).shift()}
};

exports.showPointTable = function(){
	var pointTable = fs.existsSync(pointTableFile) && JSON.parse(fs.readFileSync(pointTableFile, 'utf8'))[0];
	var playersName = Object.keys(pointTable.round1);
	var nameTemplate = tableRepresentation.generateNameTemplate(playersName);
	var tableAttr = tableRepresentation.generatePointTableAttribute();
	var pointsTemplate = tableRepresentation.generatePointsTemplate(pointTable);
	return '<table>'+nameTemplate + tableAttr + pointsTemplate+'</table>';
};