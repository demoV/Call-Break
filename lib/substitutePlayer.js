var ld = require('lodash');
var Events = require('events').EventEmmiter;
var http = require('http');

var HOST = 'localhost';
var PORT = '4000'; 


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
        var options = {
            hostname: HOST,
            port: PORT,
            path: '/join_bot',
            method: 'POST',
            headers: {
                'cookie': substitute.cookie,
                'content-type': 'application/x-www-form-urlencoded'
            }
        };
        var req = substitute.http.request(options, function(res){
            var callBack = function(){
                
                if(res.body.join){
                    var name = res.headers["set-cookie"][0].split(';')[0];
                    var game = res.headers["set-cookie"][1].split(';')[0];
                    substitute.id = name.split('=')[1];
                    substitute.cookie = name + '; ' +game;
                    console.log(substitute.id,'id is');
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
        console.log('joinGame');
        var substitute = this;
        var options = {
            hostname: HOST,
            port: PORT,
            path: '/update',
            method: 'GET',
            headers: {
                'cookie': substitute.cookie,
                'content-type': 'application/x-www-form-urlencoded'
            }
        };
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
        var options = {
            hostname: HOST,
            port: PORT,
            path: '/tableStatus',
            method: 'GET',
            headers: {
                'Cookie': substitute.cookie,
                'content-type': 'application/x-www-form-urlencoded'
            }
        };
        var req = substitute.http.request(options, function(res){
            var callBack = function(){
                var tableStatus = res.body;
                if(tableStatus.currentTurn == substitute.id){
                    if(!tableStatus.isAllPlayerCalled)
                        substitute.makeCall(3);
                    else
                        substitute.throwCard();
                }
                if(tableStatus.isRoundOver){
                    substitute.startNewRound();
                }
            };
            bodyParser(res, callBack);
        });
        req.end();
    },
    throwCard: function(){
        var substitute = this;
        var options = {
        hostname: HOST,
        port: PORT,
        path: '/throwableCards',
        method: 'GET',
        headers: {
            'Cookie': substitute.cookie,
            'content-type': 'application/x-www-form-urlencoded'
            }
        };
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
        var options = {
            hostname: HOST,
            port: PORT,
            path: '/throwCard',
            method: 'POST',
            headers: {
                'Cookie': substitute.cookie,
                'content-type': 'application/x-www-form-urlencoded'
                }
        };
        req = substitute.http.request(options, function(res){
            var callBack = function(){
                var status = res.body;
                if(status){

                }
            }
            bodyParser(res, callBack);
        });
        card = 'card=' + card;
        req.write(card);
        req.end();
    },
    makeCall: function(call){
        var substitute = this;
        var options = {
            hostname: HOST,
            port: PORT,
            path: '/call',
            method: 'POST',
            headers: {
                'Cookie': substitute.cookie,
                'content-type': 'application/x-www-form-urlencoded'
            }
        };
        req = substitute.http.request(options, function(res){});
        call = 'call=' + call;
        req.write(call);
        req.end();
    },
    startNewRound: function() {
        var substitute = this;
        var options = {
            hostname: HOST,
            port: PORT,
            path: '/newRound',
            method: 'POST',
            headers: {
                'Cookie': substitute.cookie,
                'content-type': 'application/x-www-form-urlencoded'
            }
        };
        req = substitute.http.request(options, function(res){});
        req.end();
    }
}
module.exports = Substitute;
// new Substitute("raj").ready();
// new Substitute("Me").ready();
// new Substitute("eKIFHD").ready();