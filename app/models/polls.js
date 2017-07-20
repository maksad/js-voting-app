'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./users.js');
 
var Poll = new Schema({ 
  author: User,
  title: String,
  options: [
    {
      title: String,
      voters: [String]
    }
  ] 
});

module.exports = mongoose.model('Poll', Poll);
