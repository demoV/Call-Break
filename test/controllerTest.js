var controller = require('../lib/controller.js');
var request = require('supertest');

describe("controller",function(){
	var game;
	controller = controller(game);
	describe("/",function(){
		it("should serve index.html",function(done) {
			request(controller)
				.get('/')
				.expect(200)
				.expect(/Call-Break/, done)
		});	
	}); 
}); 
