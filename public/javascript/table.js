var onLoad = function(){
	getHandCards();
	getPlayersNames();
	removeCard();
};

var removeCard = function(){
		$('td' ).click(function() {
		console.log('this')
	    	console.log('div',this);
	    	this.remove();
	});	
};

var getHandCards = function(){
	$.get('cards', function(data){
		hands = JSON.parse(data);
		hands.forEach(function(card){
			$('#hands').append('<td>'+'<img src="../resources/resource/'+card+'">'+'</td>');
		});
	});
};

var getPlayersNames = function(){
	$.get('names', function(playersPosition){
		var positions = JSON.parse(playersPosition);
		$('.top_player>#name').append('<h3>'+positions.top_player+'</h3>');
		$('.right_side_player>#name').append('<h3>'+positions.right_player+'</h3>');
		$('.left_side_player>#name').append('<h3>'+positions.left_player+'</h3>');
		$('#hand_cards>#name').append('<h3>'+positions.my+'</h3>');
	});
};

$(document).ready(onLoad);

