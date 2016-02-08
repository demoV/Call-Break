var hands;
var interval;
var deckCardsOfPlayers = [];
var myId = '';
var onLoad = function(){
	getHandCards();
	getPlayersNames();
	interval = setInterval(requestForTableStatus, 500);
	setTimeout(addClick, 2500);
};


//-----------------------pointTable Template-------------------------------//

var tempforPlayerName = function(playerName){
    return '<th>'+playerName+'</th>'
}

var tableHeadTemp = function(playerNames){
    var heading = ''
    heading += "<table id='PointTable'><tr><th>rounds</th>"
    playerNames.forEach(function(player){
        heading += tempforPlayerName(player);
    });
    return heading+'</tr>';
};

var roundTemplate = function(round){
    return '<tr><td>'+round+'</td>';
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

//--------------------Template Fn End--------------------------------------// == true


var throwCardAnimation = function(id){
    var deckPosition = $('#bottom_player').offset();
    var card_Position = $('#'+id).offset();
    var animationCordinate = {x:  deckPosition.left - card_Position.left,
                                y:deckPosition.top - card_Position.top};
    $('#'+id).removeClass('hands').addClass('any');
    move("#"+id)
    .to(animationCordinate.x, animationCordinate.y)
    // .rotate('180')
        .set('border-color', 'black')
        .duration('.5s')
        .end();
        setTimeout(function(){
        	showOnDeckDiv(id)
        },400);
}

var showOnDeckDiv = function(id){
    $('#bottom_player').html($('#' + id).html());
    $('#' + id).html('');
}
var addClick = function(){
	// $('.hands').one('click',throwCard);
	$('.throwableCards').one('click',throwCard);
};
var throwCard = function(){
	var self = this;
	$.post('throwCard' , {card : this.id.slice(1)}, function(response){
		if(response.thrown == true){
		$('#'+self.id).removeClass('hand').addClass('any');
			throwCardAnimation(self.id);
			setTimeout(function(){
				_.remove(hands, function(card){
				return card == self.id.splice(1) + '.png';
				});
			showhandCards();
			},700);
			
		}
	});
};

var showButtonOfShowHandCards = function(){
	var button = '<button id="showCard" onclick="showhandCards()"></button>';
	var divForBtn = '<div style="width:30%">' + button + '</div>';
	$('#myInfor').append(divForBtn);
}
var distribute = function(position, i){
        move('#card_' + i)
        .to(position.x, position.y)
        .rotate('180')
        .scale(.5)
        .set('border-color', 'black')
        .duration('2s')
        .end();
}
var startDistribution = function (numberOfCards){
  var positions = [{x: 0, y:300}, {x: 262, y:0},{x: 0, y:-300},{x: -400, y:0}];
  var time = 100;
    for(i=0; i <= numberOfCards; i++) {
        (function(current) {
          setTimeout(function() { distribute(positions[(current + 1)%4], current); }, current * 150);
        })(i);
    }
    if(numberOfCards)
    	getHandCards();
    showButtonOfShowHandCards();
};

var setThrowableClass = function(card){
	var cardWithRank = getCardWithSuit(card.slice(0,-4));
	var template ='<td class="throwableCards hand" id="cardId">'+
				  '<div class="cards"><div class="SUIT"><p>RANK</p></div></div></td>';
	var cardDetatil = {
						cardId: '_'+card.slice(0,-4),
						SUIT: cardWithRank.suit,
						RANK: cardWithRank.rank
					};
	return template.replace(/cardId|SUIT|RANK/g,function myFunction(x){
		return cardDetatil[x];
	});
}

var getCardWithSuit = function(cardId){
    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var suits = {'S': 'suit_spades', 'D': 'suit_diamonds', 'C': 'suit_Clubs', 'H': 'suit_hearts'}; 
    var suitOfCard = cardId.slice(-1);
    var rankOfCard = +(cardId.slice(0,-1));
    return { rank: ranks[rankOfCard - 2], suit: suits[suitOfCard] };
};

var showhandCards = function(){
	var innerHtmlForHands = '';
	[].forEach.call(hands,function(card){
		innerHtmlForHands += setThrowableClass(card);
	});
	$('.hands').html(innerHtmlForHands);
	setTimeout(addClick, 700);
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
	$('.top_player #name').html('<p class="playerInfo">'+positions.top_player+'</p>');
	$('.right_side_player #name').html('<p class="playerInfo">'+positions.right_player+'</p>');
	$('.left_side_player #name').html('<p class="playerInfo">'+positions.left_player+'</p>');
	$('.my #name').html('<p class="playerInfo">'+positions.bottom_player+'</p>');
};
var setIdAtDeck = function(positions){
	var keys = Object.keys(positions);
	keys.forEach(function(key){
		$('#' + key).attr('name', positions[key]);
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
	$('.popup > #btn').click(request);
}

var postCall= function(){
	var call = $('#callInputId').val();
	$.post('call',{call:call},function(data){
			$('.call').html('<p>Your call is:' + data.call + '<p>');
			setTimeout(function(){$('.call').addClass('hidden')}, 1400);
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

var getCordinatesFor = function(playerId){
	var lastPlaysPosition = $("div[pName*=" + playerId + "]"); 
	var lastPlaysDeckPosition = $("div[name*=" + playerId + "]");
	var lastPlaysOffset = lastPlaysPosition.offset();
	var lastPlaysDeckOffset = lastPlaysDeckPosition.offset();
	return {x: lastPlaysDeckOffset.left - lastPlaysOffset.left,
								y: lastPlaysDeckOffset.top - lastPlaysOffset.top, 
								fromOffset: lastPlaysOffset};
}

var getCardForThrowAnimation = function(lastPlays){
	var thrownCard = '<div class="cards toAnimate"><div class="suit"><p>rank</p></div></div>';
	var cardWithRank = getCardWithSuit(lastPlays.card);
	thrownCard = thrownCard.replace(/suit|rank/g, function(key){
		return cardWithRank[key];
	})
	// if(lastPlays.playerId == $('.top_player').attr('pname'))
	// 	thrownCard = thrownCard.replace('leftRight', 'toAnimateTop');
	return thrownCard;
}
var showThrowAnimation = function(lastPlays){
	// if($('.my').attr('pname') == lastPlays.playerId)
	// 	return;
	var animationCordinate = getCordinatesFor(lastPlays.playerId);
	var thrownCard = getCardForThrowAnimation(lastPlays);
	$('section').append(thrownCard);
	$('.toAnimate').offset(animationCordinate.fromOffset);
	setTimeout(function(){
		move('.toAnimate')
		.duration('.5s')
		.to( animationCordinate.x, animationCordinate.y)
		// .then()
			// .set('opacity', 0)
		.end();	
		setTimeout(function(){
			$('.toAnimate').remove();	
		},550)
		
	}, 200);
}

var showOtherPlayerThrownCardAnimation = function(deckCards){
	if(deckCards.length){
		var lastPlayerIndex = deckCards.length - 1;
		var lastPlays = deckCards[lastPlayerIndex];
		if(deckCardsOfPlayers.length + 1 == deckCards.length && $('.my').attr('pname') != lastPlays.playerId)
			showThrowAnimation(lastPlays);	
	}
	setTimeout(function(){
		showDeck(deckCards);
	},700); 
}
var showDeck = function(deckCards){
	deckCardsOfPlayers = deckCards;
	if(deckCards.length == 0)
		$("div[name]").html('');
	deckCards.forEach(function(thrownCard){
		var cardWithRank = getCardWithSuit(thrownCard.card);
		var deckCardsHtml = '<div class="cards"><div class="SUIT"><p>RANK</p></div></div>';
		var cardDetatil = { SUIT: cardWithRank.suit, RANK: cardWithRank.rank};
		deckCardsHtml = deckCardsHtml.replace(/SUIT|RANK/g, function(key){
			return cardDetatil[key];
		})
		$("div[name*="+thrownCard.playerId+"]").html(deckCardsHtml);
	});
};

var showLedSuit = function(ledSuit){
	$('#ledSuit').html('<h1>Led Suit: ' + ledSuit + '</h1>');
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
	$("div[pName*=" + key + "] #captured").html('<p class="playerInfo">Captured: '+hands+ '</p>');
		$("div[pName*=" + key + "] #call").html('<p class="playerInfo">Call: '+call+ '</p>');
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

var clearDeck = function(){
    $('.deckDiv').each(function(){
        $(this).html('');
    })
}
var moveDeckCardsToWinner = function(handWinner){
	if(!handWinner)
		return;
	var positionOfWinner = $("div[pName*="+ handWinner +"]").offset();
	var thrownCardsPosition = $('.deckCards').offset();
	var animationCordinate = {
		x: positionOfWinner.left - thrownCardsPosition.left,
		y: positionOfWinner.top - thrownCardsPosition.top
	};
	if(deckCardsOfPlayers.length){
		move('.deckCards')
		.to(animationCordinate.x, animationCordinate.y)
		.then()
			.set('opacity', 0)
		.end();

		setTimeout(function(){
			clearDeck();
			move('.deckCards')
			.x(0)
			.then()
			.set('opacity', 1)
			.end();
		},1000);	
	}
}
var showTableStatus = function(tableStatus){
	var handWinner = tableStatus.currentHand.winner;
	showCallPopup(tableStatus.currentTurn, tableStatus.isAllPlayerCalled);
	// showDeck(tableStatus.deck);
	showOtherPlayerThrownCardAnimation(tableStatus.deck);
	showCapturedHand(tableStatus.capturedDetail);
	showTurn(tableStatus.currentTurn);
	moveDeckCardsToWinner(handWinner);
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
					    '<p>'+winner+'</p>'+
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
