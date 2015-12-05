var hands;
var onLoad = function(){
	getHandCards();
	getPlayersNames();
	// setTimeout(showPopup,3000);
	var interval = setInterval(requestForTableStatus, 4000);
};

var throwCard = function(){
	var self = this;
	$.post('throwCard' , {card : this.id}, function(response){
		if(response == 'thrown successfully'){
			_.remove(hands, function(card){
				return card == self.id + '.png';
			});
		}
		showhandCards(hands);
	});
}
var removalCards = function(){
	console.log('removalCards');
	$('.throwableCards').each(function(){
		$(this).one('click',throwCard);
	})
};
var showhandCards = function(handCards){
	var innerHtmlForHands = '';
	hands.forEach(function(card){
		innerHtmlForHands += ('<td id="'+card.slice(0,-4)+'"><img src="../resources/resource/'+card+'">'+'</td>');
	});
	$('#hands').html(innerHtmlForHands);
};
var getHandCards = function(){
	$.get('cards', function(data){
		hands = JSON.parse(data);
		showhandCards(hands);
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

var requestForThrowableCard = function(){
	$.get('throwableCard',function(cards){
		var throwableCards = JSON.parse(cards);
		console.log(throwableCards,'throwableCards');
		hands.forEach(function(card){
			if(throwableCards.indexOf(card) != -1){
				var cardId = '#' + card.slice(0,-4);
				$(cardId).addClass('throwableCards');
			}
		});
	});
};
var showDeck = function(deckCards){
	console.log(deckCards,' deckCards');
	var deckCardsHtml = '';
	deckCards.forEach(function(thrownCard){
		deckCardsHtml += '<img src="../resources/resource/' + thrownCard.card + '">';
	});
	$("#deck").html(deckCardsHtml);
};
var showLedSuit = function(ledSuit){
	$('#ledSuit').html('<h2>Led Suit: ' + ledSuit + '</h2>');
	$('#ledSuit').addClass('show');
};
var requestForTableStatus = function(){
	console.log('requestForTableStatus');
	$.get('tableStatus',function(data){
		console.log(data);
		var tableStatus = JSON.parse(data);
		showDeck(tableStatus.deck);
		if(tableStatus.ledSuit)
			showLedSuit(tableStatus.ledSuit);
		if(tableStatus.turn == true){
			requestForThrowableCard();
			removalCards();
		}
	});
};
$(document).ready(onLoad);