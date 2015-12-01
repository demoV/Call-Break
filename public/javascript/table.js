var onLoad = function(){
	$.get('cards', function(data){
		console.log(data)
			$('#hands').html(generateTableData(data));	
	});
}

var generateTableData = function(hands){
	hands = JSON.parse(hands);
	return hands.map(function(card){
		return '<td>'+'<img src="../resources/resource/'+card+'">'+'</td>'
	});
};
$(document).ready(onLoad);