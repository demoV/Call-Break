var Deck=require("./deck.js").Deck;

var game={};
exports.game=game;

game.Game=function(pack) {
	this.players={};
	this.playerSequence=[];
	this.pack=pack;
	this.deck=new Deck();
	this.currentPlayerIndex=-1;
};

game.Game.prototype = {
	addPlayer:function(player){
		if(!this.canStartGame() && !this.hasPlayer(player)) {
			this.players[player.name]=player;
			this.playerSequence.push(player);
		}
	},
	canStartGame:function() {
		return Object.keys(this.players).length==4;
	},
	hasPlayer:function(player) {
		return this.players.hasOwnProperty(player.name);
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
	},
	currentPlayer:function() {
		return this.playerSequence[this.currentPlayerIndex];
	}
};