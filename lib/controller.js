var ld = require('lodash');
var fs = require('fs');
var querystring = require('querystring');
var EventEmitter = require('events').EventEmitter;
var cookieParser  = require('cookie-parser');
var bodyParser = require('body-parser');
var p=require("./player.js").entities;

var rEmitter = new EventEmitter();



var method_not_allowed = function(req, res){
	res.statusCode = 405;
	res.end('Method is not allowed');
};

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

var serveJoinPage = function(req ,res , next){
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



var resForJoining = function(req , res, next){
	var playerName = req.body.userName;
	if(req.game.hasPlayer(req.cookies.name)){
		var status = {alreadyConnected : true };
		res.end(JSON.stringify(status));
	}
	else{
		res.writeHead(200 ,{'Set-Cookie': 'name='+playerName });
		var player=new p.Player(playerName);
		req.game.addPlayer(player);
		res.end('success');
	}
};
	
var sendUpdate = function(req , res, next){
	if(req.game.canStartGame()){
		req.game.start();
		res.end(JSON.stringify({status : 'started'}));
	}else{
		res.end(JSON.stringify({noOfPlayers : req.game.numberOfPlayers()}));
	}
};

var serveHandCards = function(req, res, next){
	var hand=req.game.handOf(req.cookies.name);
	var cardImages=hand.map(cardToImg);
	res.end(JSON.stringify(cardImages));
};

var cardToImg=function(card) {	
	return card.rank.toString()+card.suit[0].toUpperCase()+".png";
}
			

var servePlayersNames = function(req,res,next){
	var playerSequence=req.game.getPlayerSequenceFor(req.cookies.name);
	res.end(JSON.stringify(playerSequence));
};

var throwCard = function(req, res, next){
	var name = req.cookies.name;
	var card = req.body.card;
	var game = req.game;
	if(!game.isCardThrowableFor(name,card) || !game.isCurrentPlayer(name) || !game.isAllPlayerCalled()){
		res.end('notAllowed');
	}
	else{
		game.makePlay(name,card);
		game.collectThrownCards();
		res.end('thrown successfully');	
	}
};

var getTableStatus = function(req,res,next){
	var game = req.game;
	if(game.hasPlayer(req.cookies.name))
		res.end(JSON.stringify(game.status()));
	else{
		req.url = '/html/joinPage.html';
		res.statusCode = 302;
		next();
	}
};

var isNewRoundStarted = function(req,res,next){
	res.end(JSON.stringify(!req.game.isRoundOver()));
}
var startNewRound = function(req, res, next){
	req.game.startNewRound();
	res.end(JSON.stringify(true));
}
var serveThrowableCards = function(req,res,next){
	var playerName = req.cookies.name;
	var throwableCards=req.game.throwableCardsFor(playerName);
	res.end(JSON.stringify(throwableCards));
};

var makeCall = function(req ,res,next ){
	req.game.callFor(req.cookies.name ,+req.body.call);
	res.end(JSON.stringify({call : +req.body.call}));
}

var post_handlers = [
	{path : '', handler : bodyParser.urlencoded({ extended: true }) },
	{path : '', handler : cookieParser() },
	{path : '^/join_user$' , handler : resForJoining},
	{path : '^/html/call$' , handler : makeCall},
	{path: '^/html/newRound$', handler: startNewRound},
	{path : '^/html/throwCard$' , handler : throwCard},
	{path: '', handler: method_not_allowed}
];

var get_handlers = [
	{path : '', handler : bodyParser.urlencoded({ extended: true }) },
	{path : '', handler :  cookieParser()},
	{path: '^/$', handler: serveIndex},
	{path: '^/join$' , handler : serveJoinPage},
	{path: '^/help$' , handler : serveHelpPage},
	{path: '^/update$' , handler : sendUpdate},
	{path: '^/html/cards$', handler: serveHandCards},
	{path:'^/html/names$', handler: servePlayersNames},
	{path: '^/html/tableStatus$', handler: getTableStatus},
	{path: '^/html/isStarted$', handler: isNewRoundStarted},
	{path: '^/html/throwableCard$', handler: serveThrowableCards},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];

var matchHandler = function(url){
	return function(ph){
		return url.match(new RegExp(ph.path));
	};
};

rEmitter.on('next', function(handlers, req, res, next){
	if(handlers.length == 0) return;
	var ph = handlers.shift();
	ph.handler(req, res, next);
});

var handle_all_post = function(req, res){
	var handlers = post_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
}; 
var handle_all_get = function(req, res){
	var handlers = get_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
};

var loadGame = function(req ,res,game){
	req.game = game;
}

module.exports = function(game){
	return function(req, res){
		loadGame(req ,res ,game);
		if(req.method == 'GET')
			handle_all_get(req, res);
		else if(req.method == 'POST')
			handle_all_post(req, res);
		else
			method_not_allowed(req, res);
	};
};
