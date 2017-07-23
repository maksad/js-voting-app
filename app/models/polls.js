'use strict';

var mongoose = require('mongoose');
<<<<<<< HEAD
var Schema = mongoose.Schema;

var Poll = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
=======
var Schema = mongoose.Schema; 
 
var Poll = new Schema({ 
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
>>>>>>> 8bc1b2e... wip
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
