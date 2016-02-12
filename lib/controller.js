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

var serveTeamPage = function(req ,res){
	var fileName = path.join(__dirname,'../public/html/team.html');
	res.sendFile(fileName);
};

var serveTable = function(req ,res){
	var fileName = path.join(__dirname,'../public/html/table.html');
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
	if(req.game.canStartGame()){
		req.game.start();
		res.send({isStarted : true});
	}else{
		res.send({noOfPlayers : req.game.numberOfPlayers(),
				nameOfPlayers : req.game.getPlayersName() });
	}
};

var serveHandCards = function(req, res){
	if(!req.game.hasPlayer(req.cookies.name))
		res.redirect('/');
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
		setTimeout(function(){
			game.collectThrownCards();	
		},2000);
		res.send({thrown : true});	
	}
};

var sendTableStatus = function(req,res){
	if(req.game.hasPlayer(req.cookies.name))
		res.send(req.game.status());
	else{
		res.redirect('/');
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
};
var setGame = function(req ,res ,next){
	var game = req.games.gameOf(req.cookies.name);
	if(req.games.gameOf(req.cookies.name)){
		req.game = game;
	}
	next();
};

var ensureLogin = function(req ,res ,next){
	if(!req.game || !req.game.hasPlayer(req.cookies.name))
		res.redirect('/');
	else
		next();
};

var ensureGameHasStarted = function(req ,res ,next){
	if(req.game.canStartGame())
		next();
	else
		res.redirect('/join')
};

var isPlayer = function(req ,res){
	if(req.game)
		res.send({joined : true});
	else
		res.send({joined : false});
};
var removeFromGame = function(req, res){
	var game = req.games.gameOf(req.cookies.name);
	if(game){
		res.clearCookie('name');
		game.removePlayer(req.cookies.name);
	}
	res.redirect('/');	
};


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('./public'));
app.use(setGame);


app.get('/',serveIndex);
app.get('/isPlayer',isPlayer);
app.get('/join',serveJoinPage);
app.get('/help',serveHelpPage);
app.get('/team',serveTeamPage);

app.post('/join_user',resForJoining);
app.get('/update',ensureLogin,sendUpdate);

app.get('/cards',ensureLogin,ensureGameHasStarted,serveHandCards);
app.get('/names',ensureLogin,ensureGameHasStarted,servePlayersNames);
app.get('/table',ensureLogin,ensureGameHasStarted,serveTable);
app.post('/call',ensureLogin,ensureGameHasStarted,makeCall);
app.post('/throwCard',ensureLogin,ensureGameHasStarted,throwCard);
app.get('/tableStatus',ensureLogin,ensureGameHasStarted,sendTableStatus);
app.post('/newRound',ensureLogin,ensureGameHasStarted,startNewRound)
app.get('/isStarted',ensureLogin,ensureGameHasStarted,isNewRoundStarted);
app.post('/leave_table',ensureLogin, removeFromGame);


module.exports = function(games){
	return function(req,res){
		req.games = games;
		app(req,res);
	}
};