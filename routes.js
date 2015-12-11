var ld = require('lodash');
var fs = require('fs');
var querystring = require('querystring');
var callBreak = require('./javascript/callBreak.js');
var lib = require('./serveGame.js');
var p=require("./javascript/player.js").entities;

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
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
			res.statusCode = 200;
			console.log(res.statusCode);
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
	console.log(res.statusCode);
};

var joinUser = function(req ,res ,name){
	res.writeHead(200 ,{'Set-Cookie': name });
	lib.userInfo.push({name : name , id : name});
	console.log(lib.userInfo);
	res.end(JSON.stringify( {isGameStarted : lib.isGameStarted,
						     noOfPlayers : lib.userInfo.length } ));
};

var resForJoining = function(req , res, next, game){
	if(lib.isGameStarted)
			res.end(JSON.stringify({isGameStarted : true}));
	else{
		var data = '';
		req.on('data',function(chunk){
			data += chunk;
		});		
		req.on('end' , function(){
			var playerName = querystring.parse(data).name;
			var player=new p.Player(playerName);
			game.addPlayer(player);
			if(game.hasPlayer(playerName))
				res.end(JSON.stringify({alreadyConnected : true })); 
			else
				joinUser(req ,res , playerName) ;
		});
		if(lib.userInfo.length == 4){
			lib.isGameStarted = true;
		}
	}
};

var sendUpdate = function(req , res, next, game){
	if(game.canStartGame()){
		game.start();
		res.statusCode = 200;
		res.end(JSON.stringify({status : 'started'}));
	}else{
		res.end(JSON.stringify({
			isGameStarted : game.hasGameStarted(),
			noOfPlayers : game.numberOfPlayers()
		}));
	}
};

var serveHandCards = function(req, res, next, game){
	var hand=game.handOf(req.headers.cookie);
	var cardImages=hand.map(cardToImg);
	console.log(req.headers.cookie,"\n---------\n",cardImages);
	res.end(JSON.stringify(cardImages));
};

var cardToImg=function(card) {
	return card.rank.toString()+card.suit[0].toUpperCase()+".png";
}

var writeCall = function(req , res){
	var data = '';
	req.on('data' , function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		call = querystring.parse(data).call;
		lib.makeCallOf(req.headers.cookie, call);
		// game.players[req.headers.cookie].makeCall(+call);
		res.end('success');
	});
};

var servePlayersNames = function(req,res,next,game){
	var playerSequence=game.getPlayerSequenceFor(req.headers.cookie);
	res.end(JSON.stringify(playerSequence));
};

var throwCard = function(req, res, next){
	var data = '';
	req.on('data',function(chunk){
			data += chunk;
	});
	req.on('end', function(){
		lib.removeCard(data,req.headers.cookie);
		res.end('thrown successfully');
	});
};

var updateForTurn = function(req,res,next){
	var playerName = req.headers.cookie;
	res.end(JSON.stringify(lib.updateTable(playerName)));
};

var serveThrowableCards = function(req,res){
	var playerName = req.headers.cookie;
	throwableCards = lib.getThrowableCards(playerName);
	res.end(JSON.stringify(throwableCards));
};

exports.post_handlers = [
	{path : '^/join_user$' , handler : resForJoining},
	{path : '^/html/call$' , handler : writeCall},
	{path : '^/html/throwCard$' , handler : throwCard},	
	{path: '', handler: method_not_allowed}
];

exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/join$' , handler : serveJoinPage},
	{path: '^/help$' , handler : serveHelpPage},
	{path: '^/update$' , handler : sendUpdate},
	{path: '^/html/cards$', handler: serveHandCards},
	{path:'^/html/names$', handler: servePlayersNames},
	{path: '^/html/tableStatus$', handler: updateForTurn},
	{path: '^/html/throwableCard$', handler: serveThrowableCards},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
