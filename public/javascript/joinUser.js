var alreadyConnected = function(){
	return '<h3>you are already connected</h3>';
}

var gameStatus = function(noOfPlayers){
	return '<h3>No. of connected players:'+noOfPlayers+'</h3>'
}

var sendReaquestForUpdate = function(){
	$.get('update',function(data){
		if(data.isStarted){
			window.location.href = 'table';
		}
		$('#game_status').html(gameStatus(data.noOfPlayers));
	});

}

var sendReaquestToJoin = function(){
	var userName = $('#user_name').val();
	$('#user_name').val('')
	$.post('join_user',{userName:userName} , function(data){
		$('.join').remove();
		if(data.alreadyConnected)
			$('#game_status').html(alreadyConnected());
	});
	setInterval(sendReaquestForUpdate , 4000);
}

var onReady = function(){
	$('#join').click(sendReaquestToJoin);
}

$(onReady);
