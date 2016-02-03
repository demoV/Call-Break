var hands;
var interval;
var onLoad = function(){
	getHandCards();
	getPlayersNames();
	interval = setInterval(requestForTableStatus, 3000);
	setTimeout(addClick, 4000);
};

//-----------------------pointTable Template-------------------------------//

var tempforPlayerName = function(playerName){
    return '<th>'+playerName+'</th>'
}

var tableHeadTemp = function(playerNames){
    var heading = ''
    heading += '<table "id=PointTable"><tr><th>rounds</th>'
    playerNames.forEach(function(player){
        heading += tempforPlayerName(player);
    });
    return heading+'</tr>';
};

var roundTemplate = function(round){
    return '<tr><td>'+round+'<br>score</td>';
};

var tempforPlayerScore = function(playerScore){
    return '<td>'+playerScore+'</td>' 
};

var getPointTable =function(playerNames,totalRounds,playersData){
    var pointTableTemplate = '';
    pointTableTemplate += tableHeadTemp(playerNames);
    totalRounds.forEach(function(round){
        pointTableTemplate += roundTemplate(round);
        playerNames.forEach(function(player){
            pointTableTemplate += tempforPlayerScore(playersData[round][player]);
        });
        pointTableTemplate += '</tr>';
    });
    return pointTableTemplate+'</table>'+'<input type=button id="btn" value="next round">';
};

//--------------------Template Fn End--------------------------------------//

var addClick = function(){
	$('.throwableCards').one('click',throwCard);
};
var throwCard = function(){
	var self = this;
	$('.throwableCards').removeClass('throwableCards');
	$.post('throwCard' , {card : this.id}, function(response){
		if(response.thrown){
			_.remove(hands, function(card){
				return card == self.id + '.png';
			});
			// $('#'+self.id).remove();
		}
	});
	showhandCards();
};
var removalCards = function(){
	$('.throwableCards').one('click',throwCard);
};

var setThrowableClass = function(card){
	var template ='<td class="throwableCards" id="cardId">'+
				  '<img src="../resources/resource/card"></td>';
	var cardDetatil = {cardId: card.slice(0,-4) , card : card};
	return template.replace(/cardId|card/g,function myFunction(x){
		return cardDetatil[x];});
}

var showhandCards = function(){
	var innerHtmlForHands = '';
	[].forEach.call(hands,function(card){
		innerHtmlForHands += setThrowableClass(card);
	});
	$('#hands').html(innerHtmlForHands);
	setTimeout(addClick, 1000);
	return;
};

var getHandCards = function(){
	$.get('cards', function(data){
		hands = data;
		showhandCards();
	});
};
var setNameAttrToPlayersDiv = function(positions){
	$('.top_player').attr('pName', positions.top_player);
	$('.right_side_player').attr('pName', positions.right_player);
	$('.left_side_player').attr('pName', positions.left_player);
	$('.my').attr('pName', positions.bottom_player);
}
var showPlayersName = function(positions){
	$('.top_player #name').html('<h3>'+positions.top_player+'</h3>');
	$('.right_side_player>#name').html('<h3>'+positions.right_player+'</h3>');
	$('.left_side_player>#name').html('<h3>'+positions.left_player+'</h3>');
	$('.my #name').html('<h3>'+positions.bottom_player+'</h3>');
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
		var playerSequence = _playerSequence;
		var positions=seqAsTablePositions(playerSequence);
		showPlayersName(positions);
		setIdAtDeck(positions);
		setNameAttrToPlayersDiv(positions);
	});
};

var templateForCall = '<h1>Select your call</h1><br>'+
				'<input type="range" name="callInputName" id="callInputId" value="2" min="2" max="8" oninput="callOutputId.value = callInputId.value">'+
				'<br><output name="callOutputName" id="callOutputId">2</output><br><input type=button id="btn" value="submit">';


var showPopup = function(template,request){
	$('.popup').removeClass('hidden');
	$('.popup').html(template);
	$('.popup>#btn').click(request);
}

var postCall= function(){
	var call = $('#callInputId').val();
	$.post('call',{call:call},function(data){
			alert(data.call);
	});
	$('.popup').addClass('hidden');
	interval = setInterval(requestForTableStatus, 3000);
};

var requestForThrowableCard = function(){
	$.get('throwableCard',function(cards){
		var throwableCards = cards;
		hands.forEach(function(card){
			if(throwableCards.indexOf(card.slice(0,-4)) != -1){
				var cardId = '#' + card.slice(0,-4);
				$(cardId).addClass('throwableCards');
			}
		});
	});
};

var showDeck = function(deckCards){
	if(deckCards.length == 0)
		$("div[name]").html('');
	deckCards.forEach(function(thrownCard){
		var deckCardsHtml = '<img src="../resources/resource/'+thrownCard.card + '.png">';
		$("div[name*="+thrownCard.playerId+"]").html(deckCardsHtml);
	});
};

var showLedSuit = function(ledSuit){
	$('#ledSuit').html('<h2>Led Suit: ' + ledSuit + '</h2>');
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
		var hands = capturedDetail[key].captured;
		var call = capturedDetail[key].call;
	$("div[pName*=" + key + "] #captured").html('<h3>Captured: '+hands+ '</h3>');
		$("div[pName*=" + key + "] #call").html('<h3>Call: '+call+ '</h3>');
	});
}

var setIntervalTo = function(interval, time, callBack){
	interval = setInterval(callBack, time);
};

var stopIntervalOf = function(interval){
	clearInterval(interval);
}

var isNewRoundStart = function(){
	$.get('isStarted', function(response){
		var status = response;
		// if(status){
			// stopIntervalOf(interval);
			onLoad();
		// }game
	})
};
var reqForNewRound = function(){
	$.post('newRound', {status: true}, function(response){
		var status = response;
		if(status){
			isNewRoundStart();
			$('.popup').addClass('hidden');
		}			
	});	
}

var showCallPopup = function(currentPlayerName, isAllPlayerCalled){
	if((document.cookie.slice(5) == currentPlayerName) && !isAllPlayerCalled){
		clearInterval(interval);
		showPopup(templateForCall,postCall);	
	}
}

var showTableStatus = function(tableStatus){
	var handWinner = tableStatus.currentHand.winner;
	showCallPopup(tableStatus.currentTurn, tableStatus.isAllPlayerCalled);
	showDeck(tableStatus.deck);
	showCapturedHand(tableStatus.capturedDetail);
	showTurn(tableStatus.currentTurn);
	showHandWinner(handWinner);
	if(tableStatus.ledSuit)
		showLedSuit(tableStatus.ledSuit);
}

var exit = function(){
	document.cookie = '';
	window.location.href = '/';
}

var finishGame = function(winner){
	var template = '<div><h1>Game Over</h1>'+
					'<h2>Congratulations</h2>'+
					    '<h3>'+winner+'</h3>'+
 			 		'</div><input type="submit" id="btn" value="exit">';
	showPopup(template,exit);
}


var showPointTable =function(tableStatus){
	var pointTableData = tableStatus.pointTable;
	var allRounds = Object.keys(pointTableData);
	var playersName = Object.keys(pointTableData.round1);
	var html = getPointTable(playersName,allRounds,pointTableData);
	showPopup(html, reqForNewRound);
}

var requestForTableStatus = function(){
	$.get('tableStatus',function(tableStatus){
		console.log(tableStatus);
		if(tableStatus.isRoundOver==true){
			clearInterval(interval);
           	showPointTable(tableStatus);
		}
		else if(tableStatus.isGameOver){
			finishGame(tableStatus.winner);
		}
		else 
			showTableStatus(tableStatus);	
	});
};

$(document).ready(onLoad);
