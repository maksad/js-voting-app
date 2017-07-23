'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollsHandler () {
  this.singlePoll = function (req, res) {
    Polls
      .findOne({'_id': req.params.id})
      .exec(function (err, result) {
        if (err) { throw err; }

        res.render('poll', {
          singlePoll: JSON.stringify(result)
        });
      }
    );
  };

  this.getPolls = function (req, res) {
    Polls
      .find({}, function (err, result) {
        if (err) { throw err; }

        res.render('polls', {
          polls: JSON.stringify(result)
        });
      });
  };

  this.myPolls = function (req, res) {
    Polls
      .find({}, function (err, result) {
        if (err) { throw err; }

        res.render('my-polls', {
          polls: JSON.stringify(result)
        });
      });
  };

  this.addPoll = function (req, res) {
    var title = req.body.title;
    var options = req.body.options;
    options = options.split(',').map(opt => opt.trim());

    if (title === '' || title === ' ') {
      return res.render(
        'new-poll',
        {error: 'Title cannot be empty.'}
      );
    }

    if (options.length < 2) {
      return res.render(
        'new-poll',
        {error: 'You must provide at least two options separated with comma.'}
      );
    }

    options = options.map((option) => {
      return { title: option }
    });
    var poll = new Polls({
      'author': req.user,
      title: title,
      options: options
    });

    poll.save((err, poll) => {
      if (err) return console.error(err);
      res.redirect('my-polls');
    });
  };
}

module.exports = PollsHandler;
