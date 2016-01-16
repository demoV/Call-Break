var ld=require("lodash");
var cardIdGenerator=require("./cardIdGenerator.js").lib;
var Turn=require("./turn.js").Turn;
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
	start:function() {
		this.currentPlayerIndex=0;
		this.pack.shuffle();
		this.distribute();
		this.gameHasStarted=true;
		this.deletePointTable();
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
		if(this.isRoundOver()){
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
		if(playerId!=this.currentPlayer().name)
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
	},
	indexof: function(playerName){
		var playerNames=this.playerSequence.map(function(p){
				return p.name;
			});
		return playerNames.indexOf(playerName);
	},
	callFor:function(playerName, call){
		if(this.currentPlayer().name == playerName){
			var player = this.getPlayerByName(playerName);
			player.makeCall(call);		
		}
	}
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
		if(!this.isCurrentTurnComplete())
			return;
		this.updatePointTable();
		this.currentTurnWinner = this.winnerOfTurn();
		this.discardPile.cards = this.discardPile.cards.concat(this.currentTurn.thrownCards());
		this.currentTurn = new Turn();
	},
	changePack: function(){
		if(this.discardPile.numberOfCards() >1){
			var playedCards = JSON.parse(JSON.stringify(this.discardPile.cards));
			this.pack.cards = playedCards;
			this.discardPile.cards = [];
		}
	},
    updatePointTable : function(){
    	if(this.isRoundOver())
        	this.pointTable.updatePointTableOf(this.players);
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
    }
};
