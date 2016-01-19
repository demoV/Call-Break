var ld = require('lodash');
var fs = require('fs');
var querystring = require('querystring');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var cookieParser  = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var p=require("./player.js").entities;

var serveIndex = function(req,res){
	var fileName = path.join(__dirname,'../public/html/index.html');
	res.sendFile(fileName);
};

var serveJoinPage = function(req,res){
	var fileName = path.join(__dirname,'../public/html/joinPage.html');
	res.sendFile(fileName);
};

var serveHelpPage = function(req,res){
	var fileName = path.join(__dirname,'../public/html/help.html');
	res.sendFile(fileName);
};

var serveTable = function(req ,res){
	var location = '../public/html/table.html';
	if(!req.game.hasPlayer(req.cookies.name)){
		location = '../public/html/joinPage.html';
	}
	var fileName = path.join(__dirname,location);
	res.sendFile(fileName);
}
var resForJoining = function(req , res){
	var playerName = req.body.userName;
	if(req.game){
		var status = {alreadyConnected : true };
		res.send(status);
	}
	else{
		res.cookie('name',playerName);
		var player=new p.Player(playerName);
		req.games.addPlayer(player);
		res.send({join : true});
	}
};

	
var sendUpdate = function(req , res){
	if(!req.game)
		return;
	if(req.game.canStartGame()){
		req.game.start();
		res.send({isStarted : true});
	}else{
		res.send({noOfPlayers : req.game.numberOfPlayers()});
	}
};

var serveHandCards = function(req, res){
	if(!req.game.hasPlayer(req.cookies.name))
		res.redirect('/html/joinPage.html');
	var hand=req.game.handOf(req.cookies.name);
	var cardImages=hand.map(cardToImg);
	res.send(cardImages);
};

var cardToImg=function(card) {	
	return card.rank.toString()+card.suit[0].toUpperCase()+".png";
}	

var servePlayersNames = function(req,res){
	var playerSequence=req.game.getPlayerSequenceFor(req.cookies.name);
	res.send(playerSequence);
};

var throwCard = function(req, res){
	var name = req.cookies.name;
	var card = req.body.card;
	var game = req.game;
	if(!game.isCardThrowableFor(name,card) || !game.isCurrentPlayer(name) || !game.isAllPlayerCalled()){
		res.send({notValid : true});
	}
	else{
		game.makePlay(name,card);
		game.collectThrownCards();
		res.send({thrown : true});	
	}
};

var sendTableStatus = function(req,res){
	if(req.game.hasPlayer(req.cookies.name))
		res.send(req.game.status());
	else{
		res.redirect('/html/joinPage.html');
	}
};

var isNewRoundStarted = function(req,res){
	res.send(!req.game.isRoundOver());
};


var startNewRound = function(req, res){
	req.game.startNewRound();
	res.send(true);
};

var makeCall = function(req ,res){
	req.game.callFor(req.cookies.name ,+req.body.call);
	res.send({call : +req.body.call});
}

var setGame = function(req ,res ,next){
	var game = req.games.gameOf(req.cookies.name);
	if(req.games.gameOf(req.cookies.name)){
		req.game = game;
	}
	next();
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('./public'));
app.use(setGame);


app.get('/',serveIndex)
app.get('/join',serveJoinPage);
app.get('/help',serveHelpPage);
app.post('/join_user',resForJoining);
app.get('/update',sendUpdate)
app.get('/cards',serveHandCards);
app.get('/names',servePlayersNames);
app.get('/table',serveTable);
app.get('/tableStatus',sendTableStatus);
app.post('/newRound',startNewRound)
app.get('/isStarted',isNewRoundStarted);
app.post('/call',makeCall);
app.post('/throwCard',throwCard);


module.exports = function(games){
	return function(req,res){
		req.games = games;
		app(req,res);
	}
};