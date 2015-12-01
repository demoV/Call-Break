var fs = require('fs');
var querystring = require('querystring');
var ld = require('lodash');
var callBreak = require('./javascript/callBreak.js');
var game = new callBreak.CreateGame(['bhimaa', 'shangha', 'mugambo', 'shakaal']);
// var connect = {};
// exports.connect = connect;
var userInfo = [];
var isGameStarted = false;

var isConnected = function(req , res){
	return userInfo.some(function(user){
		return req.headers.cookie = user.id;
	})
}

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
}
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	console.log(res.statusCode);
};

var joinUser = function(req ,res ,data){
	userInfo.push({name : data.slice(-5) , id : req.headers.cookie});
	// console.log(userInfo);
	res.end(JSON.stringify( {isGameStarted : isGameStarted,
						     noOfPlayers : userInfo.length } ));
}

var resForJoining = function(req , res){
	console.log('==================== cookie is this',req.headers.cookie)
	if(isGameStarted)
			res.end('{isGameStarted : true}');
	else{
		var data = '';
		req.on('data',function(chunk){
			data += chunk;
		});		
		req.on('end' , function(){
			var playerName = querystring.parse(data).name;
			res.writeHead(200 ,{'Set-Cookie': playerName });
			isConnected(req ,res) ? res.end('{alreadyConected : true }') : joinUser(req ,res , playerName) ;
		})
		if(userInfo.length == 4){
			isGameStarted = true;
		}
	}
}

var sendUpdate = function(req , res){
	if(userInfo.length == 1){
		res.statusCode = 200;
		res.end(JSON.stringify({status : 'started'}));
	}else{
		res.end(JSON.stringify({
			isGameStarted : isGameStarted,
			noOfPlayers : userInfo.length,
		}));
	}
}
var cardsInImg = function(hands){
	var keys = Object.keys(hands);
	return ld.flatten(keys.map(function(suit){
		return hands[suit].sort(function(a,b){return b.rank - a.rank}).map(function(card){
			return card.rank+(card.suit.slice(0,1)).toUpperCase()+'.png';
		});
	}));
};
var serveHandCards = function(req, res, next){
	game.distribute();
	var hands = cardsInImg(game.players['shakaal'].hands);
	console.log(hands);
	res.end(JSON.stringify(hands));
}

exports.post_handlers = [
	{path : '^/join_user$' , handler : resForJoining},	
	{path: '', handler: method_not_allowed}
	
];
exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/join$' , handler : serveJoinPage},
	{path : '^/update$' , handler : sendUpdate},
	{path: '^/html/cards$', handler: serveHandCards},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];

