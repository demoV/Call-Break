var interval;
var alreadyConnected = function(){
	return '<p>you are already connected</p>';
}

var gameStatus = function(info){
	// console.log(info,'info');
	var status = '<p>No. of connected players: '+info.noOfPlayers+'</p><div class="list">';
	info.nameOfPlayers.forEach(function(pName){
		status+= '<li>'+pName+'</li>';
	});
	status+='</div>';
	return status;

}

var sendRequestForUpdate = function(){
	$.get('update',function(data){
		if(data.isStarted){
			window.location.href = 'table';
		}
		$('#game_status').html(gameStatus(data));
	});

}

var sendRequestToJoin = function(){
	var userName = $('#user_name').val();
	$('#user_name').val('')
	$.post('join_user',{userName:userName} , function(data){
		$('.join').remove();
		$('.leave').removeClass('hidden');
		if(data.alreadyConnected)
			$('#game_status').html(alreadyConnected());
	});
	interval = setInterval(sendRequestForUpdate , 1000);
}

var showFormTemp = function(){
	$.get('isPlayer',function(status){
		if(!status.joined){
			$('.join').html($("#input_temp").html());
			$('#join').click(sendRequestToJoin);
		}else{
			interval = setInterval(sendRequestForUpdate , 1000);
		}
	});
}

var onReady = function(){
	showFormTemp();
}

$(onReady);
