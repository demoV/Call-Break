var interval;
var alreadyConnected = function(){
	return '<p>you are already connected</p>';
};
var gameStatus = function(info){
	// var status = '<p>connected players are :</p>';
	// info.nameOfPlayers.forEach(function(pName,i){
		// status+= '<li><b>'+(i+1)+'</b> :</li>';
	// });
	status+='<br><div class="wait">Wait a moment.....</div>';
	return status;

};

var sendRequestForUpdate = function(){
	$.get('update',function(data){
		if(data.isStarted){
			window.location.href = 'table';
		}
		$('#game_status').html(gameStatus(data));
	});
};

var sendRequestToJoin = function(){
	var userName = $('#user_name').val();
	$('#user_name').val('')
	$.post('join_user_fast_play',{userName:userName} , function(data){
		$('.join').remove();
		$('.leave').removeClass('hidden');
		if(data.alreadyConnected)
			$('#game_status').html(alreadyConnected());
	});
	interval = setInterval(sendRequestForUpdate , 1000);
};

var showFormTemp = function(){
	$.get('isPlayer',function(status){
		if(!status.joined){
			$('.join').html($("#input_temp").html());
			$('#join').click(sendRequestToJoin);
		}else{
			interval = setInterval(sendRequestForUpdate , 1000);
			$('.leave').removeClass('hidden');
		}
	});
};

var onReady = function(){
	showFormTemp();
};

$(onReady);
