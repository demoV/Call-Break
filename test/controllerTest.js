var assert = require('chai').assert;
var controller = require('../lib/controller');
var request = require('supertest');
var sinon = require('sinon');
var qs = require('querystring');
var games;

beforeEach(function(){
	games = {
		gameOf : sinon.stub(),
		addPlayer : sinon.spy()
	};
});

describe('controller',function(){
	describe('GET /',function(){
		it('should serve the landing page',function(done){

			games.gameOf.returns.undefined;

			var handler = controller(games);

			request(handler)
				.get('/')
				.expect(/<h1>Call-Break<\/h1>/)
				.expect(200,done);
		});
	});
	describe('GET /join',function(){
		it('should serve the login page if client is not exist in game',function(done){

			games.gameOf.returns.true;

			var handler = controller(games);

			request(handler)
				.get('/join')
				.expect(/JOIN TABLE/)
				.expect(200,done)
		});
	});

	describe('GET /help',function(){
		it('should serve the help page',function(done){

			games.gameOf.returns.true;

			var handler = controller(games);

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

			games.gameOf.withArgs('A').returns(game);

			var handler = controller(games);

			request(handler)
				.post('/join_user')
				.set('Cookie','name=A')
				.expect(JSON.stringify({alreadyConnected : true}),done)
		});
		it('should add player if player not exist in the game',function(done){
			var game = {};
			games.gameOf.withArgs('A').returns(game);
			var handler = controller(games);

			request(handler)
				.post('/join_user')
				.send('userName=B')
				.expect(200)
				.end(function(err  , res){
					assert.ok(games.addPlayer.calledOnce);
					assert.deepEqual(res.body ,{ join : true });
					done();
				})
		});
	});

	describe('GET /update',function(){
		it('should  give no of players joined in the game if game has not started' ,function(done){
			var game = { canStartGame : sinon.stub().returns(false),
						 numberOfPlayers : sinon.stub().returns(2)
						};
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.get('/update')
				.expect(200)
				.expect(/\{"noOfPlayers":2\}/,done);
		});

		it('should  give canStartGame true if four players has joined in the game' ,function(done){

			var game = { canStartGame : sinon.stub().returns(true),
						 start : sinon.spy()
					};
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.get('/update')
				.expect(200)
				.expect(/\{"canStartGame":true\}/)
				.end(function(err , res){
					// assert.ok(game.start.called);
					done();
				});
		});
	});

	describe('/table',function(){
		it('should serve the table',function(done){
			var game = { hasPlayer : sinon.stub()}
			game.hasPlayer.withArgs('A').returns(true);
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.get('/table')
				.set('Cookie','name=A')
				.expect(/<div id="hand_winner"><\/div>/)
				.expect(200,done)
		});

		it('should redirect to login page to invalid players',function(done){
			var game = { hasPlayer : sinon.stub()}
			game.hasPlayer.withArgs('A').returns(true);
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.get('/table')
				.set('Cookie','name=B')
				.expect(/JOIN TABLE/)
				.expect(200,done)
		});
	});

	describe('GET /cards',function(){
		it('should serve hand cards of player',function(done){
			var handCards = ['AD' , 'AC'];
			var hand  = { map : sinon.stub()};
			var game = {handOf : sinon.stub(),
						hasPlayer : sinon.stub()
						};
			games.gameOf.returns(game);


			hand.map.returns(handCards);
			game.handOf.withArgs('A').returns(hand);
			game.hasPlayer.withArgs('A').returns(true);

			
			var handler = controller(games);

			request(handler)
				.get('/cards')
				.set('Cookie','name=A')
				.expect(200)
				.expect(handCards,done)
		});
	});

	describe('GET /names',function(){
		it('shoud give the sequence of all players according to player',function(done){
			var playerSequence = ['A' ,'B' ,'C' ,'D']
			var game = { getPlayerSequenceFor : sinon.stub()};

			game.getPlayerSequenceFor.withArgs('A').returns(playerSequence);
			games.gameOf.returns(game);


			var handler = controller(games);

			request(handler)
				.get('/names')
				.set('Cookie','name=A')
				.expect(200)
				.expect(JSON.stringify(playerSequence),done)

		});
	});

	describe('POST /call',function(){
		it('should write the players call',function(done){
			var game = { callFor : sinon.spy()};
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.post('/call')
				.send(qs.stringify({call : 2}))
				.set('Cookie','name=A')
				.expect(200)
				.end(function(err ,res){
					assert.ok(game.callFor.withArgs('A',2).calledOnce);
					done();
				})
		});
	});

	describe('GET /tableStatus',function(){
		it('should give the current status of game if player exist in the game',function(done){
			var status ={ deck:[],
				turn:true,
				capturedDetail: {},
				currentHand:{isOver:false,winner: "" },
				currentTurn: "A",
			}

			var game = { status : sinon.stub(),
						 hasPlayer : sinon.stub()
						};
			game.status.returns(status);
			game.hasPlayer.withArgs('A').returns(true);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(200)
				.expect(JSON.stringify(status) ,done)
		});

		it('should redirect to login page if palyer is not exist in the game',function(done){
			
			var game = {  hasPlayer : sinon.stub() };

			game.hasPlayer.withArgs('A').returns(false);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect('Location','/html/joinPage.html',done)
		});

	});

	describe('POST /throwCard',function(){
		it('should throw the card if provided card is allowed to throw',function(done){
			var card = {card : 'AC'}
			var game = { isCardThrowableFor : sinon.stub(),
				isAllPlayerCalled : sinon.stub(),
				isCurrentPlayer : sinon.stub(),
				makePlay : sinon.spy(),
				collectThrownCards : sinon.spy()
			}
			game.isCardThrowableFor.withArgs('A','AC').returns(true);
			game.isCurrentPlayer.withArgs('A').returns(true);
			game.isAllPlayerCalled.returns(true);

			games.gameOf.returns(game);
			
			var handler = controller(games);

			request(handler)
				.post('/throwCard')
				.set('Cookie','name=A')
				.send(qs.stringify(card))
				.expect({thrown :true})
				.expect(200)
				.end(function(err ,res){
					assert.ok(game.makePlay.withArgs('A','AC').calledOnce);
					// assert.ok(game.collectThrownCards.calledOnce);
					done();
				})
				
		});

		it('should not allow to throw card if it,s not player,s turn even cards is thrwable for player',function(done){
			var card = {card : 'AD'};
			var game = {
					isCardThrowableFor :sinon.stub(),
					isCurrentPlayer : sinon.stub()
				};
			game.isCurrentPlayer.withArgs('A').returns(false);
			game.isCardThrowableFor.withArgs('A','AD').returns(true);

			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.post('/throwCard')
				.set('Cookie','name=A')
				.send(qs.stringify(card))
				.expect({notValid : true})
				.expect(200,done)
		});

		it('should not allow to throw card if card is not thowable for player even it,s player turn',function(done){
			var card = {card : 'AD'};
			var game = {
					isCardThrowableFor :sinon.stub(),
					isCurrentPlayer : sinon.stub(),
					collectThrownCards : sinon.spy()
				};
			game.isCurrentPlayer.withArgs('A').returns(true);
			game.isCardThrowableFor.withArgs('A','AD').returns(false);

			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.post('/throwCard')
				.set('Cookie','name=A')
				.send(qs.stringify(card))
				.expect({notValid : true})
				.expect(200,done)	
		});
	});

	describe('not found',function(){
		it('should give not found messege if requested file is not available',function(done){
			var handler = controller(games);

			request(handler)
				.get('/server')		
				.expect(404 ,done)
		});
	});

});
