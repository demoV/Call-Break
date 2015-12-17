
var gameStarted = function(){
	return '<h3> A game is already running</h3>'
}

var alreadyConnected = function(){
	return '<h3>you are already connected</h3>';
}

var gameStatus = function(noOfPlayers){
	return '<h3>No. of connected palyers:'+noOfPlayers+'</h3>'
}

var sendReaquestForUpdate = function(){
	$.get('update',function(data){
		if(JSON.parse(data).status == 'started'){
			window.location.href = '../html/table.html'
		}
		$('#game_status').html(gameStatus(JSON.parse(data).noOfPlayers));
	});

}

var sendReaquestToJoin = function(){
	var userName = $('#user_name').val();
	$('#user_name').val('')
	$.post('join_user',{name:userName} , function(data){
		$('.join').remove();
		if(JSON.parse(data).alreadyConnected){
			$('#game_status').html(alreadyConnected());
		}
		if(JSON.parse(data).isGameStarted){
			$('#game_status').html(gameStarted());
		}
	});
}

var onReady = function(){
	$('#join').click(sendReaquestToJoin);
	var interval = setInterval(sendReaquestForUpdate , 4000);
}

$(onReady);
