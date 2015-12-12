var ld=require("lodash");
var cardIdGenerator=require("./cardIdGenerator.js").lib;
var Turn=require("./turn.js").Turn;
var game={};
exports.game=game;

game.Game=function(pack) {
	this.players={};
	this.playerSequence=[];
	this.pack=pack;
	this.currentPlayerIndex=0;
	this.gameHasStarted=false;
	this.currentTurn=new Turn();
};

game.Game.prototype = {
	addPlayer:function(player){
		if(!this.canStartGame() && !this.hasPlayer(player)) {
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
	hasPlayer:function(player) {
		return this.players.hasOwnProperty(player.name);
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
	},
	currentPlayer:function() {
		return this.playerSequence[this.currentPlayerIndex];
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
			detail[p.name]=0;
			return detail;
		},{})
	},
	status:function() {
		return {
			deck:this.currentTurn.cardIds(),
			turn:true,
			capturedDetail:this.captures(),
			currentHand:{isOver:false,winner:""},
			currentTurn:this.playerSequence[this.currentPlayerIndex].name
		}
	},
	makePlay:function(playerId,cardId) {
		var player=this.players[playerId];
		var card=cardIdGenerator.toCard(cardId);
		this.currentTurn.addPlay({player:player,card:card});
		this.currentPlayerIndex=(this.currentPlayerIndex+1)%(this.playerSequence.length);
	},
	throwableCards:function(playerId) {
		return this.players[playerId].hand.map(cardIdGenerator.toId);
	}
};