var pointTable = require('./pointTable.js');
var generateNameTemplate = function(names){
	var nameTemplate = names.map(function(name){
		return '<th colspan="3">'+name+'</th>'
	});
	nameTemplate.unshift('<tr><th>rounds</th>');
    nameTemplate.push('</tr>'); 
	return nameTemplate.join('\n');
};

var generatePointTableAttribute = function(playersLength){
	return '<tr><td></td>'+Array(playersLength+1).join('<td>call</td><td>captured</td><td>score</td>\n')+'</tr>';
};

var setPointsOrder =function(pointsTemplate,allRounds,rounds){
	var allplayersName = Object.keys(rounds.round1);
	allRounds.forEach(function(eachRound){
		pointsTemplate.push('<tr><td>'+eachRound+'</td>');
		allplayersName.forEach(function(player){
			var player = rounds[eachRound][player];
			Object.keys(player).forEach(function(attr){
				pointsTemplate.push('<td>'+player[attr]+'</td>');
			});
		});
		pointsTemplate.push('</tr>');
	});
};

var generatePointsTemplate = function(rounds){
	var pointsTemplate = [];
	var allRounds = Object.keys(rounds);
    setPointsOrder(pointsTemplate,allRounds,rounds);
    return pointsTemplate.join('\n');
};

module.exports = finalRepresentationOf = function(pointTable){
	var playersName = Object.keys(pointTable.round1);
	var nameTemplate = generateNameTemplate(playersName);
	var tableAttr = generatePointTableAttribute(playersName.length);
	var pointsTemplate = generatePointsTemplate(pointTable);
	return '<table border="1" id="PointTable">'+nameTemplate + tableAttr + pointsTemplate+'</table>';
};
