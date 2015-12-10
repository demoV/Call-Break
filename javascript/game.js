var game={};
exports.game=game;

game.Game=function() {
	this.players={};
	this.playerSequence=[];
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
	}
};