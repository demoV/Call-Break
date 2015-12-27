var ld = require('lodash');
var fs = require('fs');
var querystring = require('querystring');
var EventEmitter = require('events').EventEmitter;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var p=require("./player.js").entities;

var serveIndex = function(req, res, next){
	req.url = '/html/index.html';
	next();
};
var serveStaticFile = function(req, res, next){
	var filePath = './public' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.end(data);
		}
		else{
			next();
		}
	});
};

var serveJoinPage = function(req ,res , next ,game){
		req.url = '/html/joinPage.html';
		next();
};

var serveHelpPage = function(req ,res , next){
	req.url = '/html/help.html';
	next();
}
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');	
};

var resForJoining = function(req , res, next, game){
	var playerName = req.body.userName;
	if(game.hasPlayer(req.cookies.name)){
		var status = {alreadyConnected : true };
		res.end(JSON.stringify(status));
	}
	else{
		res.writeHead(200 ,{'Set-Cookie': 'name='+playerName });
		var player=new p.Player(playerName);
		game.addPlayer(player);
		res.end('success');
	}
};
	
var sendUpdate = function(req , res, next, game){
	if(game.canStartGame()){
		game.start();
		res.statusCode = 200;
		res.end(JSON.stringify({status : 'started'}));
	}else{
		res.end( JSON.stringify({noOfPlayers : game.numberOfPlayers() }) );
	}
};

var serveHandCards = function(req, res, next, game){
	var hand=game.handOf(req.cookies.name);
	var cardImages=hand.map(cardToImg);
	res.end(JSON.stringify(cardImages));
};

var cardToImg=function(card) {	
	return card.rank.toString()+card.suit[0].toUpperCase()+".png";
}
			
var writeCall = function(req , res){};

var servePlayersNames = function(req,res,next,game){
	var playerSequence=game.getPlayerSequenceFor(req.cookies.name);
	res.end(JSON.stringify(playerSequence));
};

var throwCard = function(req, res, next,game){
	if(!game.isCardThrowableFor(req.cookies.name,req.body.card) 
		|| game.currentPlayer().name != req.cookies.name){
		res.end('notAllowed');
	}
	else{
		game.makePlay(req.cookies.name,req.body.card)
		res.end('thrown successfully');	
	}
};

var updateForTurn = function(req,res,next,game){
	if(game.hasPlayer(req.cookies.name))
		res.end(JSON.stringify(game.status()));
	else{
		req.url = '/html/joinPage.html';
		res.statusCode = 302;
		next();
	}

};

var serveThrowableCards = function(req,res,next,game){
	var playerName = req.cookies.name;
	var throwableCards=game.throwableCardsFor(playerName);
	res.end(JSON.stringify(throwableCards));
};

var post_handlers = [
	{path : '', handler : bodyParser.urlencoded({ extended: true }) },
	{path : '', handler : cookieParser() },
	{path : '^/join_user$' , handler : resForJoining},
	{path : '^/throwCard$' , handler : throwCard},
	{path: '', handler: method_not_allowed}
];

var get_handlers = [
	{path : '', handler : bodyParser.urlencoded({ extended: true }) },
	{path : '', handler :  cookieParser()},
	{path: '^/$', handler: serveIndex},
	{path: '^/join$' , handler : serveJoinPage},
	{path: '^/help$' , handler : serveHelpPage},
	{path: '^/update$' , handler : sendUpdate},
	{path: '^/cards$', handler: serveHandCards},
	{path:'^/names$', handler: servePlayersNames},
	{path: '^/tableStatus$', handler: updateForTurn},
	{path: '^/throwableCard$', handler: serveThrowableCards},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];


var rEmitter = new EventEmitter();

var matchHandler = function(url){
	return function(ph){
		return url.match(new RegExp(ph.path));
	};
};

rEmitter.on('next', function(handlers, req, res, next, game){
	if(handlers.length == 0) return;
	var ph = handlers.shift();
	ph.handler(req, res, next, game);
});

var handle_all_post = function(req, res, game){
	var handlers = post_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next, game);
	};
	next();
}; 
var handle_all_get = function(req, res, game){
	var handlers = get_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next, game);
	};
	next();
};


var method_not_allowed = function(req, res){
	res.statusCode = 405;
	res.end('Method is not allowed');
};


module.exports = function(game){
	return function(req, res){
		if(req.method == 'GET')
			handle_all_get(req, res, game);
		else if(req.method == 'POST')
			handle_all_post(req, res, game);
		else
			method_not_allowed(req, res);
	};
}
