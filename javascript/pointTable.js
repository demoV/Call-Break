var fs = require('fs');
var ld = require('lodash');
var pointsFile = './data/pointTable.json';
var pointTable = fs.existsSync(pointsFile) && JSON.parse(fs.readFileSync(pointsFile, 'utf8')) || [];

exports.currentRoundPoints = function(){
	var inc = 0;
	return function(players){
		inc++;
		var round = 'round'+inc;
		return ld.zipObject(Object.keys(players).map(function(player){
			return [players[player].name,players[player].round];
		}));
	}
};

exports.add = function(entry){
	pointTable.unshift(entry);
	save();
};
var save = function(){
	fs.writeFile(pointFile, JSON.stringify(pointTable), function(err){});
};

exports.getAllPoints = function(){
	return comments;
};