var hands;
var interval;
var onLoad = function(){
	getHandCards();
	getPlayersNames();
	interval = setInterval(requestForTableStatus, 3000);
	// setIntervalTo(interval, 3000, requestForTableStatus);
	setTimeout(addClick, 4000);
};

var addClick = function(){
	$('.throwableCards').one('click',throwCard);
}
var throwCard = function(){
	var self = this;
	$('.throwableCards').removeClass('throwableCards');
	$.post('throwCard' , {card : this.id}, function(response){
		if(response == 'thrown successfully'){
			_.remove(hands, function(card){
				return card == self.id + '.png';
			});
		}
	});
	showhandCards(hands);
}
var removalCards = function(){
	$('.throwableCards').one('click',throwCard);
};
var showhandCards = function(handCards){
	var innerHtmlForHands = '';
	hands.forEach(function(card){
		innerHtmlForHands += ('<td class="throwableCards" id="'+card.slice(0,-4)+'"><img src="../resources/resource/'+card+'">'+'</td>');
	});
	$('#hands').html(innerHtmlForHands);
	setTimeout(addClick, 1000);
	return;
};

var getHandCards = function(){
	$.get('cards', function(data){
		hands = JSON.parse(data);
		showhandCards(hands);
	});
};
var setNameAttrToPlayersDiv = function(positions){
	$('.top_player').attr('pName', positions.top_player);
	$('.right_side_player').attr('pName', positions.right_player);
	$('.left_side_player').attr('pName', positions.left_player);
	$('.my').attr('pName', positions.bottom_player);
}
var showPlayersName = function(positions){
	$('.top_player>#name').html('<h3>'+positions.top_player+'</h3>');
	$('.right_side_player>#name').html('<h3>'+positions.right_player+'</h3>');
	$('.left_side_player>#name').html('<h3>'+positions.left_player+'</h3>');
	$('.my>#name').html('<h3>'+positions.bottom_player+'</h3>');
};
var setIdAtDeck = function(positions){
	var keys = Object.keys(positions);
	keys.forEach(function(key){
		$('.deck #' + key).attr('name', positions[key]);
	});
};

var seqAsTablePositions=function(playerSequence) {
	return { bottom_player: playerSequence[0],
			right_player: playerSequence[1],
			top_player: playerSequence[2],
			left_player: playerSequence[3]};
};

var getPlayersNames = function(){
	$.get('names', function(_playerSequence){
		var playerSequence = JSON.parse(_playerSequence);
		var positions=seqAsTablePositions(playerSequence);
		showPlayersName(positions);
		setIdAtDeck(positions);
		setNameAttrToPlayersDiv(positions);
	});
};

var templateForCall = '<h1>Select your call</h1><br>'+
				'<input type="range" name="callInputName" id="callInputId" value="2" min="2" max="8" oninput="callOutputId.value = callInputId.value">'+
				'<br><output name="callOutputName" id="callOutputId">2</output><br><input type=button id="btn">';


var showPopup = function(template,request){
	$('.popup').removeClass('hidden');
	$('.popup').html(template);
	$('.popup>#btn').click(request);
}

var postCall= function(){
	var call = $('#callInputId').val();
	$.post('call',{call:call},function(data){
		data = JSON.parse(data);
		console.log(data);
			alert(data.call);
	});
	$('.popup').addClass('hidden');
	// setIntervalTo(interval, 3000, requestForTableStatus);
	interval = setInterval(requestForTableStatus, 3000);
};

var requestForThrowableCard = function(){
	$.get('throwableCard',function(cards){
		var throwableCards = JSON.parse(cards);
		console.log(throwableCards);
		hands.forEach(function(card){
			if(throwableCards.indexOf(card.slice(0,-4)) != -1){
				var cardId = '#' + card.slice(0,-4);
				console.log(cardId);
				$(cardId).addClass('throwableCards');
			}
		});
	});
};

var showDeck = function(deckCards){
	if(deckCards.length == 0)
		$("div[name]").html('');
	deckCards.forEach(function(thrownCard){
		var deckCardsHtml = '<img src="../resources/resource/' + thrownCard.card + '.png">';
		$("div[name*="+thrownCard.playerId+"]" ).html(deckCardsHtml);
	});
};
var showLedSuit = function(ledSuit){
	$('#ledSuit').html('<h2>Led Suit: ' + ledSuit + '</h2>');
	$('#ledSuit').addClass('show');
};
var showHandWinner = function(winner){
	$('#hand_winner').html('<h1> Captured By: ' + winner + '</h1>');
}
var showTurn = function(playerId){
	$("div[pName]").removeClass('turn');
	$("div[pName*=" + playerId + "]").addClass('turn');
}
var showCapturedHand = function(capturedDetail){
	var keys = Object.keys(capturedDetail);
	keys.forEach(function(key){
		console.log(key,'capturedDetail');
		$("div[pName*=" + key + "] > #captured").html('<h3>Captured: '+ capturedDetail[key].captured + '</h3>');
		$("div[pName*=" + key + "] > #call").html('<h3>Call: '+ capturedDetail[key].call + '</h3>');
	});
	// $("div[pName*=" + handWinner + "] > #captured").html('<h3>Captured: '+ totelCaptured + '</h3>');
}
var setIntervalTo = function(interval, time, callBack){
	interval = setInterval(callBack, time);
};
var stopIntervalOf = function(interval){
	clearInterval(interval);
}

var isNewRoundStart = function(){
	$.get('isStarted', function(response){
		var status = JSON.parse(response);
		// if(status){
			// stopIntervalOf(interval);
			onLoad();
		// }game
	})
};
var reqForNewRound = function(){
	$.post('newRound', {status: true}, function(response){
		var status = JSON.parse(response);
		if(status){
			isNewRoundStart();
			$('.popup').addClass('hidden');
		}
			
			// setIntervalTo(interval, 3000, isNewRoundStart);
	});	
}

var showCallPopup = function(currentPlayerName, isAllPlayerCalled){
	if((document.cookie.slice(5) == currentPlayerName) && !isAllPlayerCalled){
		clearInterval(interval);
		showPopup(templateForCall,postCall);	
	}
}

var requestForTableStatus = function(){
	$.get('tableStatus',function(status){
		console.log(status);
		var tableStatus = JSON.parse(status);
		if(tableStatus.isRoundOver==true){
			clearInterval(interval);
			showPopup(tableStatus.pointTable + '<input type=button id="btn">', reqForNewRound);
		}
		showCallPopup(tableStatus.currentTurn, tableStatus.isAllPlayerCalled);
		showDeck(tableStatus.deck);
		showCapturedHand(tableStatus.capturedDetail);
		showTurn(tableStatus.currentTurn);
		
		var handWinner = tableStatus.currentHand.winner;
		
		showHandWinner(handWinner);
		if(tableStatus.ledSuit)
			showLedSuit(tableStatus.ledSuit);	
		
	});
};

$(document).ready(onLoad);
