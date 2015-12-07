exports.generateNameTemplate = function(names){
	var nameTemplate = names.map(function(name){
		return '<th colspan="3">'+name+'</th></tr>'
	});
	nameTemplate.splice(0,0,'<tr><th>rounds</th>');
	return nameTemplate.join('');
};

exports.generatePointTableAttribute = function(){
	return '<tr><td></td>'+Array(5).join('<td>call</td><td>captured</td><td>score</td>')+'</tr>';
};

exports.setPointsOrder =function(pointsTemplate,allRounds,rounds){
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

exports.generatePointsTemplate = function(rounds){
	var pointsTemplate = [];
	var allRounds = Object.keys(rounds);
	if(allRounds.length < 6){
		exports.setPointsOrder(pointsTemplate,allRounds,rounds);
		return pointsTemplate;
	}
	else{
		allRounds.pop();
		exports.setPointsOrder(pointsTemplate,allRounds,rounds);
		pointsTemplate.push('<th>WINNER : '+rounds.winnerName+'</th>');
		return pointsTemplate;
	};
};
