var ld = require('lodash');
var fs = require('fs');
var querystring = require('querystring');
var callBreak = require('./javascript/callBreak.js');

var game;
exports.userInfo = [];
exports.isGameStarted = false;
var nameOfPlayers = function(){
	return exports.userInfo.map(function(info){
		return info.name;
	});
};

exports.isConnected = function(playerName){
	return exports.userInfo.some(function(user){
		return playerName == user.id;
	});
};

var cardsToImg = function(hands){
	var keys = Object.keys(hands);
	return ld.flatten(keys.map(function(suit){
		return hands[suit].sort(function(a,b){
			return b.rank - a.rank;
		}).map(function(card){
			return card.rank+(card.suit.slice(0,1)).toUpperCase()+'.png';
		});
	}));
};

exports.getHandCards = function(playerName){
	return cardsToImg(game.players[playerName].hands);
};
exports.startGame = function(){
	if(!game){
		game = new callBreak.CreateGame(nameOfPlayers());
		game.distribute();
		game.setPlayersTurn();	
	}
};

exports.getPlayersPositions = function(playerName){
	var playersName = nameOfPlayers();
	var i = playersName.indexOf(playerName);
	return { bottom_player: playersName[i],right_player: playersName[(i+1)%4],
			top_player: playersName[(i+2)%4], left_player: playersName[(i+3)%4]};
};

var toCardName = function(cardImgName){
	var rankName = ['two' , 'three' , 'four' ,'five' , 'six' , 'seven' , 'eight',
						'nine','ten' , 'jack' , 'queen' , 'king' ,'ace'];
	var suits = ['clubs' , 'diamonds' , 'hearts' , 'spades'];
	var suit = suits.filter(function(suit){
		return suit.slice(0,1)==cardImgName.slice(-1).toLowerCase();
	}).join('');
	card = +cardImgName.slice(0,-1);
	return [rankName[card - 2],'of' , suit].join('_');
};
var deckCards = function(){
	var deckCards = JSON.parse(JSON.stringify(game.deck.thrownCards));
	deckCards.forEach(function(thrownCard){
		thrownCard.card = thrownCard.card.rank+(thrownCard.card.suit.slice(0,1)).toUpperCase()+'.png';
	});
	return deckCards;
};
var setTurnAfterHand = function(deckCards){
	var keys = Object.keys(game.players);
	var playerId = game.deck.highestCard().playerId;
	game.players[playerId].turn = true;
	ld.remove(keys, function(key){return key == playerId});
	keys.forEach(function(key){
		game.players[key].turn = false;
	});
};
// var handWinner = function(){

// }
var handIsOver = function(){
	setTurnAfterHand(deckCards);
	var handWinner = game.deck.highestCard().playerId;
	game.players[handWinner].wonHand();
	game.deck.thrownCards = [];
}
var pushToDeck = function(card){
	var deckCards = game.deck.thrownCards;
	deckCards.push(card);
	if(deckCards.length == 4){
		setTimeout(handIsOver, 4000);
	}
	else
		setPlayersTurn(card.playerId);
	return;
};
var whoseTurnIs = function(){
	var playerNameKeys = Object.keys(game.players);
	return playerNameKeys.filter(function(key){
		return game.players[key].turn
	})[0];
}
var getPlayersCapturedHand = function(){
	return nameOfPlayers().reduce(function(capturedinfo, playerName){
		 capturedinfo[playerName] = game.players[playerName].round.captured;
		 return capturedinfo;
	},{});
};
exports.removeCard = function(card, playerName){
	var card = querystring.parse(card).card;
	card = toCardName(card);
	var thrownCard = {card: (game.players[playerName].throwCard(card))[0], playerId: playerName};
	if(thrownCard.card){
		pushToDeck(thrownCard);
	}
	return; 
};

exports.updateTable = function(playerName){
	var tableStatus = {deck:deckCards(),turn:game.players[playerName].turn,
					currentHand: {isOver: false, winner: ''},
					capturedDetail: getPlayersCapturedHand(),
					currentTurn: whoseTurnIs()};
	if(game.deck.thrownCards.length == 4){
		tableStatus.currentHand.isOver = true;
		var handWinner = game.deck.highestCard().playerId;
		tableStatus.currentHand.winner = handWinner
	}
	if(game.deck.thrownCards[0])
		tableStatus.ledSuit = game.deck.thrownCards[0].card.suit;
	return tableStatus;
};

var isAllPlayersGaveCall = function(){
	var players = Object.keys(game.players);
	return players.every(function(player){
		return game.players[player].round;
	});
};

exports.writeCallOf = function(playerName, call){
	game.players[playerName].makeCall(call);
}
exports.getThrowableCards = function(playerName){
	if(!isAllPlayersGaveCall())
		return [];
	var throwableCards = game.throwableCards(playerName);
	return throwableCards.map(function(card){
			return card.rank+(card.suit.slice(0,1)).toUpperCase()+'.png';
		});
};

var setPlayersTurn = function(playerName){
	var players = nameOfPlayers();
	var indexOfNext = (players.indexOf(playerName) + 1) % 4;
	game.players[playerName].turn = false;
	game.players[players[indexOfNext]].turn = true;
};
