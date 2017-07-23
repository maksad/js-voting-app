'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  options: [
    {
      title: String,
      voters: [String]
    }
  ]
});

module.exports = mongoose.model('Poll', Poll);
