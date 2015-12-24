var assert = require('chai').assert;
var controller = require('../lib/controller');
var request = require('supertest');
var sinon = require('sinon');

describe('controller',function(){
	describe('/',function(){
		it('should serve the landing page',function(done){

			var handler = controller();

			request(handler)
				.get('/')
				.expect(/<h1>Call-Break<\/h1>/)
				.expect(200,done);
		})
	});
	describe('/joinPage.html',function(){
		it('should serve the login page if client is not exist in game',function(done){

			var game = {
						hasPlayer : sinon.stub().returns(false)
					}

			var handler = controller(game);

			request(handler)
				.get('/join')
				.expect(/JOIN TABLE/)
				.expect(200,done)
		});
	});
	describe('/help.html',function(){
		it('should serve the login page',function(done){

			var handler = controller();

			request(handler)
				.get('/html/help.html')
				.expect(/<h1>What is Call-Break<\/h1>/)
				.expect(200,done)
		});
	});
	describe('/join_user',function(){
		it('should respond alreadyConnected if player exist in the game',function(done){

			var game = { 
						 hasPlayer : sinon.stub().withArgs('A').returns(true)
						};

			var handler = controller(game);

			request(handler)
				.post('/join_user')
				.set('Cookie','name=B')
				.expect(/alreadyConnected/,done)
		});
		it('should add player if player exist in the game',function(done){

			var game = { 
						 hasPlayer : sinon.stub().returns(false),
						 addPlayer : sinon.spy()
						};

			var handler = controller(game);

			request(handler)
				.post('/join_user')
				.send('userName=A')
				.expect(200)
				.expect(/success/)
				.end(function(err  , res){
					assert.ok(game.addPlayer.calledOnce);
					done();
				})
		});
	});

	describe('/update',function(){
		it('should  give no of players joined in the game if game has not started ' ,function(done){
			var game = { canStartGame : sinon.stub().returns(false),
						 numberOfPlayers : sinon.stub().returns(2)
						};

			var handler = controller(game);

			request(handler)
				.get('/update')
				.expect(200)
				.expect(/\{"noOfPlayers":2\}/,done);
		});

		it('should  give canStartGame true if four players has joined in the game' ,function(done){

			var game = { canStartGame : sinon.stub().returns(true),
						 start : sinon.spy()
					};

			var handler = controller(game);

			request(handler)
				.get('/update')
				.expect(200)
				.expect(/\{"canStartGame":true\}/)
				.end(function(err , res){
					assert.ok(game.start.called);
					done();
				})
		});
	});
	describe('/html/cards',function(){
		it('should serve hand cards of player',function(done){
			var handCards = ['AD' , 'AC'];
			var hand  = { map : sinon.stub()};
			var game = {handOf : sinon.stub()};

			hand.map.returns(handCards);
			game.handOf.withArgs('A').returns(hand);

			
			var handler = controller(game);

			request(handler)
				.get('/html/cards')
				.set('Cookie','name=A')
				.expect(200)
				.expect(JSON.stringify(handCards),done)
		});
	});

	describe('/html/names',function(){
		it('shoud give the sequence of all players according to player',function(done){
			var playerSequence = ['A' ,'B' ,'C' ,'D']
			var game = { getPlayerSequenceFor : sinon.stub()};

			game.getPlayerSequenceFor.withArgs('A').returns(playerSequence)

			var handler = controller(game);

			request(handler)
				.get('/html/names')
				.set('Cookie','name=A')
				.expect(200)
				.expect(JSON.stringify(playerSequence),done)

		});
	});
});
