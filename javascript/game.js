var game={};
exports.game=game;

game.Game=function() {
	this.players={};
}

game.Game.prototype = {
	addPlayer:function(player){
		if(!this.canStartGame())
			this.players[player.name]=player;
	},
	canStartGame:function() {
		return Object.keys(this.players).length==4;
	},
	hasPlayer:function(player) {
		return this.players.hasOwnProperty(player.name);
	}
}