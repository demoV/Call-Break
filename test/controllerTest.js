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
				.expect(/C♠ll-Break/)
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
		it('should  give count and name of players joined in the game if game has not started' ,function(done){
			var game = { canStartGame : sinon.stub().returns(false),
						 numberOfPlayers : sinon.stub().returns(2),
						 getPlayersName : sinon.stub().returns(['A','B']),
						 hasPlayer : sinon.stub().returns(true)

						};
			games.gameOf.returns(game);
			var expected = {noOfPlayers :2 , nameOfPlayers : ["A","B"] };

			var handler = controller(games);

			request(handler)
				.get('/update')
				.expect(200)
				.expect(JSON.stringify(expected),done);
		});

		it('should  give canStartGame true if four players has joined in the game' ,function(done){

			var game = { canStartGame : sinon.stub().returns(true),
						 start : sinon.spy(),
						 hasPlayer : sinon.stub().returns(true)
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
		it('should redirect to main page if palyer is not exist in the game',function(done){
			
			var game = {  hasPlayer : sinon.stub() };

			game.hasPlayer.withArgs('A').returns(false);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect('Location','/',done)
		});
	});

	describe('/table',function(){
		it('should serve the table',function(done){
			var game = { hasPlayer : sinon.stub(),
				canStartGame : sinon.stub()}
			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.get('/table')
				.set('Cookie','name=A')
				.expect(/<div id="hand_winner"><\/div>/)
				.expect(200,done)
		});

		it('should redirect to main page to invalid players',function(done){
			var game = { hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()}

			game.hasPlayer.withArgs('B').returns(false);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.get('/table')
				.set('Cookie','name=B')
				.expect(302)
				.expect('Location','/',done)
		});
		it('should redirect to waiting page to valid players if game is not started',function(done){
			var game = { hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()
					};

			game.hasPlayer.withArgs('B').returns(true);
			game.canStartGame.returns(false);
			games.gameOf.returns(game);

			var handler = controller(games);

			request(handler)
				.get('/table')
				.set('Cookie','name=B')
				.expect(302)
				.expect('Location','/join',done)
		});

	});

	describe('GET /cards',function(){
		it('should serve hand cards of player',function(done){
			var handCards = ['AD' , 'AC'];
			var hand  = { map : sinon.stub()};
			var game = {handOf : sinon.stub(),
						hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()
						};
			games.gameOf.returns(game);


			hand.map.returns(handCards);
			game.handOf.withArgs('A').returns(hand);
			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);
			
			var handler = controller(games);

			request(handler)
				.get('/cards')
				.set('Cookie','name=A')
				.expect(200)
				.expect(handCards,done)
		});
		it('should redirect to main page if player is not exist in the game',function(done){
			var game = {hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()
					};

			games.gameOf.returns(game);
			
			game.hasPlayer.withArgs('A').returns(false);
			game.canStartGame.returns(true);
			
			var handler = controller(games);

			request(handler)
				.get('/cards')
				.set('Cookie','name=A')
				.expect(302)
				.expect('Location','/',done)
		});
		it('should redirect to waiting page if player exists in the game but game is not started',function(done){
			var game = {hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()
					};

			games.gameOf.returns(game);
			
			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(false);
			
			var handler = controller(games);

			request(handler)
				.get('/cards')
				.set('Cookie','name=A')
				.expect(302)
				.expect('Location','/join',done)
		});
	});

	describe('GET /names',function(){
		it('shoud give the sequence of all players according to player',function(done){
			var playerSequence = ['A' ,'B' ,'C' ,'D']
			var game = { getPlayerSequenceFor : sinon.stub(),
						hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()
			};

			game.getPlayerSequenceFor.withArgs('A').returns(playerSequence);
			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);


			var handler = controller(games);

			request(handler)
				.get('/names')
				.set('Cookie','name=A')
				.expect(200)
				.expect(JSON.stringify(playerSequence),done)

		});

		it('shoud redirect to main page if player is not valid player',function(done){
			var game = { hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()};

			game.hasPlayer.withArgs('A').returns(false);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);


			var handler = controller(games);

			request(handler)
				.get('/names')
				.set('Cookie','name=A')
				.expect(302)
				.expect('Location','/',done)

		});
		it('shoud redirect to waiting page if player is valid player but game is not started',function(done){
			var game = { hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()};

			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(false);
			games.gameOf.returns(game);


			var handler = controller(games);

			request(handler)
				.get('/names')
				.set('Cookie','name=A')
				.expect(302)
				.expect('Location','/join',done)

		});
	});

	describe('POST /call',function(){
		it('should write the players call',function(done){
			var game = { callFor : sinon.spy(),
						hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()};

			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);	
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
		it('shoud redirect to main page if player is not valid player',function(done){
			var game = { hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()};

			game.hasPlayer.withArgs('A').returns(false);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);


			var handler = controller(games);

			request(handler)
				.get('/names')
				.set('Cookie','name=A')
				.expect(302)
				.expect('Location','/',done)

		});
		it('shoud redirect to waiting page if player is valid player bt game is not started',function(done){
			var game = { hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()};

			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(false);
			games.gameOf.returns(game);


			var handler = controller(games);

			request(handler)
				.get('/names')
				.set('Cookie','name=A')
				.expect(302)
				.expect('Location','/join',done)

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
						 hasPlayer : sinon.stub(),
						 canStartGame : sinon.stub()
						};
			game.status.returns(status);
			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(200)
				.expect(JSON.stringify(status) ,done)
		});

		it('should redirect to main page if palyer is not exist in the game',function(done){
			
			var game = {  hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()
					};

			game.hasPlayer.withArgs('A').returns(false);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect('Location','/',done)
		});
		it('should redirect to waiting page if palyer exists  but game is not started',function(done){
			
			var game = {  hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()
					};

			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(false);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect('Location','/join',done)
		});
	});

	describe('POST /throwCard',function(){
		it('should throw the card if provided card is allowed to throw',function(done){
			var card = {card : 'AC'}
			var game = { isCardThrowableFor : sinon.stub(),
				hasPlayer : sinon.stub(),
				isAllPlayerCalled : sinon.stub(),
				isCurrentPlayer : sinon.stub(),
				makePlay : sinon.spy(),
				collectThrownCards : sinon.spy(),
				canStartGame : sinon.stub()
			}
			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);
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
					hasPlayer : sinon.stub(),
					isCardThrowableFor :sinon.stub(),
					isCurrentPlayer : sinon.stub(),
					canStartGame : sinon.stub()
				};
			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);
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
					hasPlayer : sinon.stub(),
					isCardThrowableFor :sinon.stub(),
					isCurrentPlayer : sinon.stub(),
					collectThrownCards : sinon.spy(),
					canStartGame : sinon.stub()
				};

			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(true);
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

		it('should redirect to main page if palyer is not exist in the game',function(done){
			
			var game = {  hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()};

			game.hasPlayer.withArgs('A').returns(false);
			game.canStartGame.returns(true);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect('Location','/',done)
		});

		it('should redirect to waiting page if palyer is exist but game is not started',function(done){
			
			var game = {  hasPlayer : sinon.stub(),
						canStartGame : sinon.stub()};

			game.hasPlayer.withArgs('A').returns(true);
			game.canStartGame.returns(false);
			games.gameOf.returns(game);


			var handler = controller(games)

			request(handler)
				.get('/tableStatus')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect('Location','/join',done)
		});
	});
	
	describe('POST quitFromGame',function(){
		it('should remove player from the game',function(done){
			var handler = controller(games)

			var game = {  hasPlayer : sinon.stub(),
						removePlayer : sinon.spy()}

			games.gameOf.returns(game);		
			request(handler)
				.post('/quitFromGame')
				.set('Cookie' , 'name=A')
				.expect(302)
				.expect('Location','/')
				.end(function(err ,res){
					// game.removePlayer.called.withArgs('A');
					done();
				})
		})
	})

	describe('not found',function(){
		it('should give not found messege if requested file is not available',function(done){
			var handler = controller(games);

			request(handler)
				.get('/server')		
				.expect(404 ,done)
		});
	});

});
