var ld=require("lodash");
var cardIdGenerator=require("./cardIdGenerator.js").lib;
var Turn=require("./turn.js").Turn;
var PointTable = require('./pointTable.js');
var game={};
exports.game=game;

game.Game=function(pack, emptyPack) {
	this.players={};
	this.playerSequence=[];
	this.pack=pack;
	this.currentPlayerIndex=0;
	this.gameHasStarted=false;
	this.currentTurn=new Turn();
	this.discardPile = emptyPack;
    this.pointTable = new PointTable();
    this.currentTurnWinner = "";
    this.Id = "";
    this.playerOnTable = [];
    this.currentRoundNumber = 1;
    this.currentPlayerStatus = {time: undefined, playerName: undefined};	
};

game.Game.prototype = {
	addPlayer:function(player){
		if(!this.canStartGame() && !this.hasPlayer(player.name)) {
			this.players[player.name]=player;
			this.playerSequence.push(player);
		}
	},
	numberOfPlayers:function() {
		return this.playerSequence.length;
	},
	canStartGame:function() {
		return Object.keys(this.players).length==4;
	},
	hasPlayer:function(playerName) {
		return this.playerSequence.some(function(player){
			return player.name == playerName;
		});
	},
	getPlayerByName:function(playerName) {
		return ld.find(this.playerSequence,function(p){
			return p.name==playerName});
	},
	getPlayerSequenceFor:function(playerName) {
		var playerNames=this.playerSequence.map(function(p){
			return p.name;
		});
		var indexOfPlayer=playerNames.indexOf(playerName);
		var sequence=[];
		sequence=sequence.concat(playerNames.slice(indexOfPlayer));
		sequence=sequence.concat(playerNames.slice(0,indexOfPlayer));
		return sequence;
	},
	getPlayersName : function(){
		return this.playerSequence.map(function(p){
			return p.name;
		});
	},
	start:function() {
		this.currentPlayerIndex=0;
		this.pack.shuffle();
		this.distribute();
		this.gameHasStarted=true;
		this.deletePointTable();
		var self = this;
		var interval = setInterval(function(){self.checkTimeoutForPlay()}, 3000);
		this.setTimeForCurrentPlayer(this.playerSequence[this.currentPlayerIndex].name);
	},
	currentPlayer:function() {
		return this.playerSequence[this.currentPlayerIndex];
	},
	isCurrentPlayer:function(name){
		return this.currentPlayer().name == name;
	},
	handOf:function(playerName) {
		var player=this.getPlayerByName(playerName);
		return player.hand;
	},
	distribute:function() {
		var playerIndex=0;
		while(this.pack.numberOfCards()>0) {
			var card=this.pack.drawTopCard();
			this.playerSequence[playerIndex].addCardToHand(card);
			playerIndex=(playerIndex+1)%this.playerSequence.length;
		}
	},
	hasGameStarted:function() {
		return this.gameHasStarted;
	},
	captures:function() {
		return this.playerSequence.reduce(function(detail,p){
			detail[p.name]=p.round;
			return detail;
		},{})
	},
	status:function() {
		var isRoundOver = false;
		var pointTable = '';
		if(this.isRoundOver() && this.isPointTableUpdated()){
			this.playerOnTable = [];
			isRoundOver = true;
			pointTable = this.pointTable.getPointTable();
		}
		return {
			deck:this.currentTurn.cardIds(),
			ledSuit: this.currentTurn.runningSuit(),
			capturedDetail:this.captures(),
			currentHand:{isOver:false,winner:this.currentTurnWinner},
			currentTurn:this.playerSequence[this.currentPlayerIndex].name,
			isAllPlayerCalled : this.isAllPlayerCalled(),
			isRoundOver: isRoundOver,
			pointTable : pointTable,
			isGameOver : this.isGameOver(),
			winner : this.tellWinner()
		}
	},
	makePlay:function(playerId,cardId) {
		if(this.isCurrentTurnComplete())
			return;
		var player=this.players[playerId];
		var card=cardIdGenerator.toCard(cardId);
		this.currentTurn.addPlay({player:player,card:card});
		this.setTurn();
	},
	winnerOfTurn:function() {
		if(this.isCurrentTurnComplete()){
			this.currentTurn.winningPlay().player.wonHand();
			return this.currentTurn.winningPlay().player.name;
		}
		return "";
	},
	isCurrentTurnComplete:function() {
		return this.currentTurn.numberOfPlaysSoFar()==this.playerSequence.length;
	},
	throwableCardsFor:function(playerId) {
		if(playerId!=this.currentPlayer().name || this.isRoundOver())
			return [];
		var hand=this.getPlayerByName(playerId).hand
		return this.currentTurn.throwableCardsIn(hand).map(cardIdGenerator.toId);
	},
	isCardThrowableFor: function(playerId, cardId){
		if(playerId!=this.currentPlayer().name)
			return false;
		var throwableCards = this.throwableCardsFor(playerId);
		return throwableCards.some(function(cId){
			return cId == cardId;
		});
	},
	setTurn: function(){
		if(this.isCurrentTurnComplete()){
			var winnerName = this.currentTurn.winningPlay().player.name;
			this.currentPlayerIndex = this.indexof(winnerName);
		}
		else
			this.currentPlayerIndex=(this.currentPlayerIndex+1)%(this.playerSequence.length);
		this.setTimeForCurrentPlayer(this.playerSequence[this.currentPlayerIndex].name);
	},
	indexof: function(playerName){
		var playerNames=this.playerSequence.map(function(p){
				return p.name;
			});
		return playerNames.indexOf(playerName);
	},
	isRoundOver: function(){
		return this.playerSequence.every(function(player){
			return player.hand.numberOfCards() == 0;
		});
	},
	startNewRound: function(){
		this.initializePlayersRound();
		this.currentPlayerIndex=0;
		this.changePack();
		this.pack.shuffle();
		this.distribute();
		this.gameHasStarted=true;
	},
	collectThrownCards: function(){
		this.currentTurnWinner = this.winnerOfTurn();
		if(!this.isCurrentTurnComplete())
			return;
		var isUpdated = this.updatePointTable();
		if(isUpdated){
			var self = this;
			setTimeout(function(){
				self.currentRoundNumber += 1;
			},10000) 
		}
		this.discardPile.cards = this.discardPile.cards.concat(this.currentTurn.thrownCards());
		this.currentTurn = new Turn();
	},
	changePack: function(){
		if(this.discardPile.numberOfCards() > 1){
			var playedCards = JSON.parse(JSON.stringify(this.discardPile.cards));
			this.pack.cards = playedCards;
			this.discardPile.cards = [];
		}
	},
    updatePointTable : function(){
    	if(this.isRoundOver())
        	return this.pointTable.updatePointTableOf(this.players, this.currentRoundNumber);
    },
    tellWinner: function(){	
    	if(this.isGameOver())
        	return this.pointTable.showWinner().winnerName;
        return '';
	},
    deletePointTable : function(){
       this.pointTable.deletePreviousPointTable();
    },
    callFor : function(playerName ,call){
    	if(this.currentPlayer().name == playerName){
	    	var player = this.getPlayerByName(playerName);
	    	player.makeCall(call);
	    	this.setTurn();
	    }
    },
    isAllPlayerCalled : function(){
    	return this.playerSequence.every(function(player){
    		return player.round.call != 0;
    	});
    },
    initializePlayersRound : function(){
    	this.playerSequence.forEach(function(player){
    		player.round = {call:0, captured: 0};
    	})
    },
    isGameOver : function(){
    	return this.pointTable.noOfPlayedRounds == this.pointTable.noOfTotalRounds;
    },
    playerReadyForPlay: function(playerName){
    	if(!this.hasPlayerOnTable(playerName))
    		this.playerOnTable.push(playerName);
    },
    hasPlayerOnTable: function(playerName){
    	return this.playerOnTable.some(function(playerN){
    		return playerName == playerN;
    	});
    },
    areAllPlayerReady: function(){
    	return this.playerOnTable.length == 4;
    },
    getNumberOfCards: function(){
    	return this.pack.numberOfCards();
    },
    isPointTableUpdated: function(){
    	return this.pointTable.isRoundUpdated(this.currentRoundNumber);
    },
    removePlayer: function(playerName){
    	ld.remove(this.playerSequence, function(p){
    		return p.name == playerName;
    	});
    	delete this.players[playerName];
    },
    substitutePlayer: function(playerName){
    	this.players[playerName].type = 'substitute';
    },
    setTimeForCurrentPlayer: function(currentPlayer){
    	var date = new Date();
    	var time = date.getTime();
	    this.currentPlayerStatus.time = time;
    	this.currentPlayerStatus.playerName = currentPlayer;
    },
    checkTimeoutForPlay: function(){
    	var timeOut = {player: 90, substitute: 8};
    	var playerName = this.currentPlayerStatus.playerName;
    	var playerType = this.players[playerName].type;
    	var date = new Date();
    	var time = date.getTime();
    	var timeDiff = (time - this.currentPlayerStatus.time)/1000;
    	if(timeDiff >= timeOut[playerType] && this.isAllPlayerCalled()){
    		var playerName = this.currentPlayerStatus.playerName;
    		this.makePlayOfCurrentPlayer(playerName);
    	}
    },
    makePlayOfCurrentPlayer: function(playerName){
    	var throwableCards = this.throwableCardsFor(playerName);
    	var game = this;
    	throwableCards.forEach(function(card){
    		card = +(card.slice(0,-4));
    	});
    	var randomCard = throwableCards[ld.random(0, throwableCards.length - 1)];
    	if(throwableCards.length){
    		game.makePlay(playerName, randomCard);
    		setTimeout(function(){
				game.collectThrownCards();	
			},2000);
    	}
    }
};
