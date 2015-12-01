var onLoad = function(){
	$.get('cards', function(data){
			$('#hand_cards').html(generateTableData(data));	
	});
}

var generateTableData = function(hands){
	hands = JSON.parse(hands);
	return hands.map(function(card){
		return '<td>'+'<img src="./resource/'+card+'">'+'</td>'
	});
};
$(document).ready(onLoad);