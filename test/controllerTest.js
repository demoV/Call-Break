var assert = require('chai').assert;
var controller = require('../lib/controller');
var request = require('supertest');
var sinon = require('sinon');
var qs = require('querystring');

describe('controller',function(){
	describe('GET /',function(){
		it('should serve the landing page',function(done){

			var handler = controller();

			request(handler)
				.get('/')
				.expect(/<h1>Call-Break<\/h1>/)
				.expect(200,done);
		});
	});
	describe('GET /join',function(){
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

	describe('GET /help',function(){
		it('should serve the login page',function(done){

			var handler = controller();

			request(handler)
				.get('/help')
				.expect(/<h1>What is Call-Break<\/h1>/)
				.expect(200,done)
		});
	});
	describe('POST /join_user',function(){
		it('should respond alreadyConnected if player exist in the game',function(done){

			var game = { hasPlayer : sinon.stub() };

			game.hasPlayer.withArgs('A').returns(true);

			var handler = controller(game);

			request(handler)
				.post('/join_user')
				.set('Cookie','name=A')
				.expect(/alreadyConnected/,done)
		});
		it('should add player if player exist in the game',function(done){

			var game = { 
						 hasPlayer : sinon.stub(),
						 addPlayer : sinon.spy()
						};
			game.hasPlayer.returns(false);
			var handler = controller(game);

			request(handler)
				.post('/join_user')
				.send('userName=B')
				.expect(200)
				.expect(/success/)
				.end(function(err  , res){
					assert.ok(game.addPlayer.calledOnce);
					done();
				})
		});
	});

	describe('GET /update',function(){
		it('should  give no of players joined in the game if game has not started' ,function(done){
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
	describe('GET /cards',function(){
		it('should serve hand cards of player',function(done){
			var handCards = ['AD' , 'AC'];
			var hand  = { map : sinon.stub()};
			var game = {handOf : sinon.stub()};

			hand.map.returns(handCards);
			game.handOf.withArgs('A').returns(hand);

			
			var handler = controller(game);

			request(handler)
				.get('/cards')
				.set('Cookie','name=A')
				.expect(200)
				.expect(JSON.stringify(handCards),done)
		});
	});

	describe('GET /names',function(){
		it('shoud give the sequence of all players according to player',function(done){
			var playerSequence = ['A' ,'B' ,'C' ,'D']
			var game = { getPlayerSequenceFor : sinon.stub()};

			game.getPlayerSequenceFor.withArgs('A').returns(playerSequence);


			var handler = controller(game);

			request(handler)
				.get('/names')
				.set('Cookie','name=A')
				.expect(200)
				.expect(JSON.stringify(playerSequence),done)

		});
	});

	describe('GET /tableStatus',function(){
		it('should give the current status of game if palyer exist in the game',function(done){
			var status ={ deck:[],
				turn:true,
				capturedDetail: {},
				currentHand:{isOver:false,winner: "" },
				currentTurn: "A"
			}

			var game = { status : sinon.stub(),
						 hasPlayer : sinon.stub()
						};
			game.status.returns(status);
			game.hasPlayer.withArgs('A').returns(true);

			var handler = controller(game)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(200)
				.expect(JSON.stringify(status) ,done)
		});

		it('should redirect to login page if palyer is not exist in the game',function(done){
			
			var game = {  hasPlayer : sinon.stub() };

			game.hasPlayer.withArgs('A').returns(false);

			var handler = controller(game)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect(/JOIN TABLE/ ,done)
		});

	});

	describe('POST /throwCard',function(){
		it('should throw the card if provided card is allowed to throw',function(done){
			var card = {card : 'AC'}
			var game = { isCardThrowableFor : sinon.stub(),
				currentPlayer : sinon.stub(),
				makePlay : sinon.spy()
			}

			game.isCardThrowableFor.withArgs('A','AC').returns(true);
			game.currentPlayer.returns({name : 'A'});

			var handler = controller(game);

			request(handler)
				.post('/throwCard')
				.set('Cookie','name=A')
				.send(qs.stringify(card))
				.expect('thrown successfully')
				.expect(200)
				.end(function(err ,res){
					assert.ok(game.makePlay.withArgs('A','AC').calledOnce)
					done();
				})
				
		});

		it('should not allow to throw card if it,s not player,s turn even cards is thrwable for player',function(done){
			var card = {card : 'AD'};
			var game = {
					isCardThrowableFor :sinon.stub(),
					currentPlayer : sinon.stub()
				};
			game.currentPlayer.returns({name : 'B'});
			game.isCardThrowableFor.withArgs('A','AD').returns(true);

			var handler = controller(game);

			request(handler)
				.post('/throwCard')
				.set('Cookie','name=A')
				.send(qs.stringify(card))
				.expect('notAllowed')
				.expect(200,done)
		});

		it('should allow to throw card if card is not thowable for player even it,s player turn',function(done){
			var card = {card : 'AD'};
			var game = {
					isCardThrowableFor :sinon.stub(),
					currentPlayer : sinon.stub()
				};
			game.currentPlayer.returns({name : 'A'});
			game.isCardThrowableFor.withArgs('A','AD').returns(false);

			var handler = controller(game);

			request(handler)
				.post('/throwCard')
				.set('Cookie','name=A')
				.send(qs.stringify(card))
				.expect('notAllowed')
				.expect(200,done)
		});
	});

	describe('not found',function(){
		it('should give not found messege if file is not available',function(done){
			var handler = controller();

			request(handler)
				.get('/server')
				.expect('Not Found')		
				.expect(404 ,done)
		});
	});

	describe('not allowed',function(){
		it('shoud give method not allowed for unallowed methods',function(done){
			var handler = controller();

			request(handler)
				.delete('/throwCards')
				.expect('Method is not allowed')
				.expect(405 ,done)
		});
	});
});
