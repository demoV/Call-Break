var controller = require('../lib/controller.js');
var request = require('supertest');
var sinon = require('sinon');

describe("controller",function(){
	describe("/",function(){
		var game;
		var reqHandler = controller(game);
		it("should serve index.html",function(done) {
			request(reqHandler)
				.get('/')
				.expect(200)
				.expect(/Call-Break/, done)
		});	
	}); 
	describe("tableStatus",function(){
		var statusUpdate = {
			deck:[],
			turn:true,
			currentHand: {isOver:false, winner: ''},
			capturedDetail: {A:0,B:0,C:0,D:0},
			currentTurn:"A"
		}
		var game = {status: sinon.stub().returns(statusUpdate)};

		var reqHandler = controller(game);
		it("should give status of game",function(done) {
			request(reqHandler)
				.get('/html/tableStatus')
				.expect(200)
				.expect(JSON.stringify(statusUpdate), done)
		});	
	});
	describe("names",function(){
		var players=['A', 'B', 'C', 'D'];
		var game = {playerSequence: players,
					getPlayerSequenceFor: sinon.stub()};
		var sequenceForPlayerA = ['A', 'B', 'C', 'D'];
		var sequenceForPlayerB = ['B', 'C', 'D', 'A'];
		game.getPlayerSequenceFor.withArgs('A').returns(sequenceForPlayerA);
		game.getPlayerSequenceFor.withArgs('B').returns(sequenceForPlayerB);

		var reqHandler = controller(game);
	 	it("gives sequence of player as it is",function(done) {
	 		request(reqHandler)
	 			.get('/html/names')
	 			.set('Cookie', 'A')
	 			.expect(JSON.stringify(sequenceForPlayerA), done)
	 	});	
	 	it("gives sequence  of player for second player", function(done){
	 		request(reqHandler)
	 			.get('/html/names')
	 			.set('Cookie', 'B')
	 			.expect(JSON.stringify(sequenceForPlayerB), done)
	 	});
	 });  
	describe("POST /throwCard",function(){
		var p1 = {name: 'A'}
		var game = {
			isCardThrowableFor: sinon.stub(),
			currentPlayer: sinon.stub(),
			makePlay: sinon.spy()
		}

		game.isCardThrowableFor.returns(true);
		game.currentPlayer.returns(p1);
	
		var reqHandler = controller(game);
		it("should throw the card of player requested if player have",function(done) {
			request(reqHandler)
				.post('/html/throwCard')
				.set('Cookie', 'A')
				.send('card=2D')
				.expect('thrown successfully', done)

		});
		it("should throw the card of player requested if player have",function(done) {
			request(reqHandler)
				.post('/html/throwCard')
				.set('Cookie', 'B')
				.send('card=5D')
				.expect('notAllowed', done)
		});
	}); 
}); 
