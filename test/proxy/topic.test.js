var topic = require('../../proxy/topic');
var expect = require('expect.js');
var support = require('../support/support');

describe('test/proxy/topic.test.js', function() {
	
	before(function(done) {
		support.ready(done);
	});
	
	it('should return topic by id', function() {
		var id = support.testTopic._id;
		topic.getTopicById(id, function(err, topic, author, last_reply) {
			expect(err).to.be(null);
			expect(topic).to.not.be(null);
			expect(topic).to.have.property('title');
			expect(author).to.have.property('name');
			expect(last_reply).to.be(null);
		});
	});
	
	it('should return topic by query', function() {
		var query = {_id: support.testTopic._id, title: support.testTopic.title};
		topic.getTopicsByQuery(query, {}, function(err, topics) {
			expect(err).to.be(null);
			expect(topics).to.be.an('array');
			expect(topics).to.have.length(1);
			// done();
		});
	});	
	
	describe('test get full topic', function() {
		it('should return topic by id', function() {
			var id = support.testTopic._id;
			console.log("id: %s", id);
			topic.getFullTopic(id, function(err, author, topic, reply) {
				expect(err).to.be(null);
				expect(author).to.not.be(null);
				expect(reply).to.not.be(null);
			});
		});


	});
});	