var user = require('../../proxy/user');
var support = require('../support/support');
var expect = require('expect.js');

describe('test/proxy/user.test.js', function() {
	// var id;
	before(function(done) {
		support.ready(done);
	});
	
	it('should get users by names', function() {
		var names = [support.normalUser.name, support.normalUser2.name];
		user.getUsersByNames(names, function(err, users) {
			expect(err).to.be(null);
			expect(users).to.be.an(Array);
			expect(users).to.have.length(2);
		});
	});
	
	it('should get user by loginname', function(done) {
		var loginname = support.normalUser.loginname;
		user.getUserByLoginName(loginname, function(err, user) {
			expect(err).to.be(null);
			expect(user).to.not.be.empty();
			id = user._id;
			done();
		});	
	});
	
	it('should get user by id', function() {
		user.getUserById(id, function(err, user) {
			expect(err).to.be(null);
			expect(user).to.not.be(null);
		});
	});
	
	it('should get user by mail', function() {
		var email = support.normalUser.email;
		user.getUserByMail(email, function(err, user) {
			expect(err).to.be(null);
			expect(user).to.not.be(null);
			expect(user).to.not.be.empty();
			expect(user).to.have.property('name');
		});
	});
	
	it('should get users by query', function() {
		var name = support.normalUser.name;
		var email = support.normalUser.email;
		user.getUsersByQuery({name: name, email: email}, {}, function(err, users) {
			expect(err).to.be(null);
			expect(users).to.be.an('array');
			expect(users).to.have.length(1);
		});
	});
});
