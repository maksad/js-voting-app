'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
    publicRepos: Number
	}, 
  polls: [{
    title: String,
    options: [String]
  }]
});

module.exports = mongoose.model('User', User);
