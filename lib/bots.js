var substitute = require('./substitutePlayer.js');

var bots = ['madhav', 'karan', 'shantosh'];
var Bots = function(){
    this.bots = {};
}
Bots.prototype = {
    callBotsWith: function(playerName) {
        var groupForOneGame = [];
        bots.forEach(function(p){
            var bot = new substitute(p);
            bot.ready();
            groupForOneGame.push(bot);
        });
        this.bots[playerName] = groupForOneGame;
    },
    stopBotsOf: function(playerName) {
        var activateBots = this.bots[playerName];
        activateBots.forEach(function(bot) {
            bot.stop();
        });
        delete this.bots[playerName];
    }
}
module.exports = Bots;