var ld = require('lodash');
var fs = require('fs');
var currentRoundPoints = require('pointTable.js').pointTable();
var lib = require('./serveGame.js');
var querystring = require('querystring');
var callBreak = require('./javascript/callBreak.js');

var game;
var userInfo = [];
var isGameStarted = false;
var nameOfPlayers = function(){
	return userInfo.map(function(info){
		return info.name;
	});
};

// var dataCollector = function(req , res){
// 	var data = '';
// 	req.on('data',function(chunk){
// 		console.log(chunk, 'chankl')
// 			data += chunk;
// 	});
// 	console.log(querystring.parse(data), 'in dataCollector')
// 	return querystring.parse(data);	
// };

var isConnected = function(req , res){
	return userInfo.some(function(user){
		return req.headers.cookie == user.id;
	});
};
// var updatePointTable = require('./javascript/pointTable.js');

var game;

var userInfo = [];
var isGameStarted = false;

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
};

var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	// console.log(res.statusCode);
};

var joinUser = function(req ,res ,name){
	res.writeHead(200 ,{'Set-Cookie': name });
	userInfo.push({name : name , id : name});
	console.log(userInfo);
	res.end(JSON.stringify( {isGameStarted : isGameStarted,
						     noOfPlayers : userInfo.length } ));
};

var resForJoining = function(req , res){
	if(isGameStarted)
			res.end('{isGameStarted : true}');
	else{
		var data = '';
		req.on('data',function(chunk){
			data += chunk;
		});		
		req.on('end' , function(){
			var playerName = querystring.parse(data).name;
			if(isConnected(req ,res))
				res.end('{alreadyConected : true }'); 
			else
				joinUser(req ,res , playerName) ;
		})
		if(userInfo.length == 4){
			isGameStarted = true;
		}
	}
};

var sendUpdate = function(req , res){
	if(userInfo.length == 1){
		if(!game)
			startGame(game);
		res.statusCode = 200;
		res.end(JSON.stringify({status : 'started'}));
	}else{
		res.end(JSON.stringify({
			isGameStarted : isGameStarted,
			noOfPlayers : userInfo.length,
		}));
	}
};

var cardsToImg = function(hands){
	var keys = Object.keys(hands);
	return ld.flatten(keys.map(function(suit){
		return hands[suit].sort(function(a,b){
			return b.rank - a.rank;
		}).map(function(card){
			return card.rank+(card.suit.slice(0,1)).toUpperCase()+'.png';
		});
	}));
};

var serveHandCards = function(req, res, next){
	// var hands = cardsToImg(game.players[req.headers.cookie].hands);
	var hands = cardsToImg(game.players['pappu halkat'].hands);
	res.end(JSON.stringify(hands));
};
var startGame = function(){
	game = new callBreak.CreateGame(nameOfPlayers());
	game.distribute();
};

var getPlayersPositions = function(playerName){
	var playersName = nameOfPlayers();
	var i = playersName.indexOf(playerName);
	return { my: playersName[i],right_player: playersName[(i+1)%4],
			top_player: playersName[(i+2)%4], left_player: playersName[(i+3)%4]};
};

var servePointTable = function(req,res){
	updatePointTable.save(game.players);
	res.end(updatePointTable.showPointTable);
};

var writeCall = function(req , res){
	var data = '';
	req.on('data' , function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		call = querystring.parse(data).call;
		game.players[req.headers.cookie].makeCall(+call);
		res.end('success');
	});
};

var servePlayersNames = function(req,res,next){
	// var playersPosition = getPlayersPositions(req.headers.cookie);
	var playersPosition = getPlayersPositions('pappu halkat');
	res.end(JSON.stringify(playersPosition));
};

var toCardName = function(cardImgName){
	var rankName = ['two' , 'three' , 'four' ,'five' , 'six' , 'seven' , 'eight',
						'nine','ten' , 'jack' , 'queen' , 'king' ,'ace'];
	var suits = ['clubs' , 'diamonds' , 'hearts' , 'spades'];
	var suit = suits.filter(function(suit){
		return suit.slice(0,1)==cardImgName.slice(-1).toLowerCase();
	}).join('');
	card = +cardImgName.slice(0,-1);
	return [rankName[card - 2],'of' , suit].join('_');
};

var throwCard = function(req, res, next){
	var data = '';
	req.on('data',function(chunk){
			data += chunk;
	});
	req.on('end', function(){
		var card = querystring.parse(data).card;
		card = toCardName(card);
		var thrownCard = {card: game.players['pappu halkat'].throwCard(card), playerId: 'pappu halkat'};
		game.deck.thrownCards.push(thrownCard);
		console.log(game.deck.thrownCards , '--------====================')
		res.end('thrown successfully');
	});
};
var cardsToImg = function(hands){
	var keys = Object.keys(hands);
	return ld.flatten(keys.map(function(suit){
		return hands[suit].sort(function(a,b){return b.rank - a.rank}).map(function(card){
			return card.rank+(card.suit.slice(0,1)).toUpperCase()+'.png';
		});
	}));
};
var serveHandCards = function(req, res, next){
	var hands = cardsToImg(game.players[req.headers.cookie].hands);
	res.end(JSON.stringify(hands));
};
var startGame = function(game){
		game = new callBreak.CreateGame(nameOfPlayers());
		game.distribute();
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
	{path : '^/help$' , handler : serveHelpPage},
	{path : '^/update$' , handler : sendUpdate},
	{path: '^/html/cards$', handler: serveHandCards},
	{path:'^/html/names$', handler: servePlayersNames},
	{path: '^/html/tableStatus$', handler: updateForTurn},
	// {path : '^pointTable$', handler: servePointTable},
	{path: '^/html/throwableCard$', handler: serveThrowableCards},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
