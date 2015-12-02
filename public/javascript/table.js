
		
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

var generateTableData = function(hands){
	hands = JSON.parse(hands);
	return hands.map(function(card){
		return '<td>'+'<img src="../resources/resource/'+card+'">'+'</td>';
	});
};

var onLoad = function(){
	$.get('cards', function(data){
		console.log(data)
			$('#hand_cards').html(generateTableData(data));	
	});
	setTimeout(showPopup,3000);
};

$(document).ready(onLoad);