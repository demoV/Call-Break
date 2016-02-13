var ld = require('lodash');
var packLib=require("./pack.js").lib;
var entities = {};
exports.entities = entities;

entities.Player = function(name){
	this.name=name;
	this.hand=packLib.emptyPack();
	this.round = {call:0, captured: 0};
	this.type = 'player';
};

entities.Player.prototype = {
	throwCard: function(card){
		return this.hand.removeCard(card);
	},
	makeCall: function(call){
		call = (this.round && this.round.call) || (call > 1) && call || 2;
		this.round.call = call;
	},
	wonHand: function(){
		this.round.captured += 1;
	},
	addCardToHand: function(card) {
		this.hand.addCard(card);
	}
};

