var ld = require('lodash');
var http = require('http');

var HOST = process.env.HEROKU_APP_URL || 'localhost';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 4000;


var bodyParser = function(res, next) {
    var data = '';
    res.on('data', function(chunk) {
        data += chunk;
    });
    res.on('end', function() {
        data = JSON.parse(data);
        res.body = data;
        next();
    });
};

var Substitute = function(name){
	this.name = name;
	this.http = http;
    this.cookie = '';
    this.id = '';
};

var createRequestOptions = function(reqURL, reqMethod,cookie){
    var options = {
            hostname: HOST,
            port: PORT,
            path: reqURL,
            method: reqMethod,
            headers: {
                'cookie': cookie,
                'content-type': 'application/x-www-form-urlencoded'
            }
        };
    return options;
}

Substitute.prototype = {
    ready: function(){
        var substitute = this;
        substitute.joinGame(substitute.name);   
    },
    stop: function(){
    	clearInterval(this.interval);
    },
    joinGame: function(name){
        var substitute = this;
        var options = createRequestOptions('/join_bot' ,'POST' ,substitute.cookie);
        var req = substitute.http.request(options, function(res){
            var callBack = function(){
                
                if(res.body.join){
                    var name = res.headers["set-cookie"][0].split(';')[0];
                    var game = res.headers["set-cookie"][1].split(';')[0];
                    substitute.id = name.split('=')[1];
                    substitute.cookie = name + '; ' +game;
                    substitute.interval = setInterval(function(){
                        substitute.isStartGame();
                    },5000);
                }
            };
            bodyParser(res,callBack);
        });
        var p = 'userName=' + name;
        req.write(p);
        req.end();
    },
    isStartGame: function() {
        var substitute = this;
        var options = createRequestOptions('/update','GET',substitute.cookie);
        var req = substitute.http.request(options, function(res){
            var callBack = function(){
                if(res.body.isStarted){
                    clearInterval(substitute.interval);
                    substitute.interval = setInterval(function(){
                        substitute.getUpdate();
                    },5000);
                }
            };
            bodyParser(res,callBack);
            
        });
        req.end();
    },
    getUpdate: function(){
        var substitute = this;
        var options = createRequestOptions('/tableStatus','GET',substitute.cookie);
        var req = substitute.http.request(options, function(res){
            var callBack = function(){
                var tableStatus = res.body;
                if(tableStatus.isGameOver)
                    substitute.stop();
                if(tableStatus.isRoundOver)
                    substitute.startNewRound(); 
                if(tableStatus.currentTurn == substitute.id){
                    if(!tableStatus.isAllPlayerCalled)
                        substitute.makeCall(3);
                    else
                        substitute.throwCard();
                }
            };
            bodyParser(res, callBack);
        });
        req.end();
    },
    throwCard: function(){
        var substitute = this;
        var options = createRequestOptions('/throwableCards','GET',substitute.cookie);
        var req = substitute.http.request(options, function(res){
            var callBack = function(){
                var throwableCards = res.body;
                var randomCard = throwableCards[ld.random(0, throwableCards.length - 1)];
                substitute.reqForThrow(randomCard);
            }
            bodyParser(res, callBack);
        });
        req.end();
    },
    reqForThrow: function(card){
        var substitute = this;
        var options = createRequestOptions('/throwCard','POST',substitute.cookie);
        req = substitute.http.request(options, function(res){
            bodyParser(res, function(){});
        });
        card = 'card=' + card;
        req.write(card);
        req.end();
    },
    makeCall: function(call){
        var substitute = this;
        var options = createRequestOptions('/call','POST',substitute.cookie);
        req = substitute.http.request(options, function(res){});
        call = 'call=' + call;
        req.write(call);
        req.end();
    },
    startNewRound: function() {
        var substitute = this;
        var options = createRequestOptions('/newRound','POST',substitute.cookie);
        req = substitute.http.request(options, function(res){});
        req.end();
    }
}

module.exports = Substitute;