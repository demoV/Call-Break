var alreadyConnected = function(){
	return '<p>you are already connected</p>';
};
var gameStatus = function(info){
	var status = '<p>connected players are :</p>';
	info.nameOfPlayers.forEach(function(pName,i){
		status+= '<li><b>'+(i+1)+'</b> : '+pName.toUpperCase()+'</li>';
	});
	status+='<br><div class="wait">wait for another '+(4-info.noOfPlayers)+' players to join...</div>';
	return status;

};

var sendReaquestForUpdate = function(){
	$.get('update',function(data){
		if(data.isStarted){
			window.location.href = 'table';
		}
		$('#game_status').html(gameStatus(data));
	});
};

var sendReaquestToJoin = function(){
	var userName = $('#user_name').val();
	$('#user_name').val('')
	$.post('join_user',{userName:userName} , function(data){
		$('.join').remove();
		if(data.alreadyConnected)
			$('#game_status').html(alreadyConnected());
	});
	setInterval(sendReaquestForUpdate , 1000);
};

var showFormTemp = function(){
	$.get('isPlayer',function(status){
		if(!status.joined){
			$('.join').html($("#input_temp").html());
			$('#join').click(sendReaquestToJoin);
		}else{
			setInterval(sendReaquestForUpdate , 1000);
		}
	});
}

var onReady = function(){
	showFormTemp();
}

$(onReady);
