var onLoad = function(){
	getHandCards();
	getPlayersNames();
	// setTimeout(showPopup,3000);
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
var popupTemplate = '<h1>Select your call</h1><br>'+
				'<input type="range" name="callInputName" id="callInputId" value="2" min="2" max="8" oninput="callOutputId.value = callInputId.value">'+
				'<br><output name="callOutputName" id="callOutputId">2</output><br><button>submit</button>';

				
var showPopup = function(){
	$('#deck').addClass('popup');
	$('#deck').html(popupTemplate);
	$('#deck>button').click(requestForCall)
}

var requestForCall = function(){
	var call = $('#call').val();
	$.post('call',{call:call},function(data){
		alert(data);
	});
	$('#deck').removeClass('popup').html('')

};


$(document).ready(onLoad);
