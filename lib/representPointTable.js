var pointTable = require('./pointTable.js');
var generateNameTemplate = function(names){
	var nameTemplate = names.map(function(name){
		return '<th>'+name+'</th>'
	});
	nameTemplate.unshift('<tr><th>rounds</th>');
    nameTemplate.push('</tr>'); 
	return nameTemplate.join('\n');
};

var setPointsOrder =function(allRounds,rounds){
    var pointsTemplate = [];
	var allplayersName = Object.keys(rounds.round1);
	allRounds.forEach(function(eachRound){
		pointsTemplate.push('<tr><td>'+eachRound+'<br>score</td>');
		allplayersName.forEach(function(player){
			var score = rounds[eachRound][player];
            pointsTemplate.push('<td>'+score+'</td>');
		});
		pointsTemplate.push('</tr>');
	});
    return pointsTemplate;
};

var generatePointsTemplate = function(rounds){
	var allRounds = Object.keys(rounds);
    var pointsTemplate = setPointsOrder(allRounds,rounds);
    return pointsTemplate.join('\n');
};

var generateTemplateForTotalScore = function(roundsScore){
    totalScoreTemplate = [];
    totalScoreTemplate.push('<tr><td>TotalScore</td>')
    Object.keys(roundsScore).forEach(function(eachPlayerTotalScore){
        totalScoreTemplate.push('<td>'+roundsScore[eachPlayerTotalScore]+'</td>');
    });
    totalScoreTemplate.push('</tr>')
    return totalScoreTemplate.join('\n');
};

module.exports = finalRepresentationOf = function(pointTable,totalScoreOfCompletedRounds){
	var playersName = Object.keys(pointTable.round1);
	var nameTemplate = generateNameTemplate(playersName);
	var pointsTemplate = generatePointsTemplate(pointTable);
    var totalScoreTemplate = generateTemplateForTotalScore(totalScoreOfCompletedRounds);
	return '<table border="1" id="PointTable">'+nameTemplate + pointsTemplate + totalScoreTemplate + '</table>';
};
