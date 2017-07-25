'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollsHandler() {
  this.votePoll = function(req, res) {
    var optionId = req.body.userChoice;
    var pollId = req.params.id;

    if (!optionId) {
      return res.status(400).send('User voted option is not defined.');
    }

  };

  this.singlePoll = function (req, res) {
    Polls
      .findOne({ '_id': req.params.id })
      .exec(function (err, result) {
        if (err) {
          return res.status(404).send('Poll was not found.');
        }

        res.render('poll', {
          singlePoll: JSON.stringify(result)
        });
      });
  };

  this.deletePoll = function (req, res) {
    Polls
      .findOne({ '_id': req.params.id })
      .exec(function (err, result) {
        if (err) {
          return res.status(404).send('Poll does not exist.');
        }

        if (result.author.toHexString() === req.user.id) {
          Polls.remove({ _id: req.params.id }, function (err) {
            return res.redirect('/my-polls');
          });
        } else {
          return res.status(403).send('You have no rights to delete this poll.');
        }
      });

  };

  this.getPolls = function (req, res) {
    Polls
      .find({}, function (err, result) {
        res.render('polls', {
          polls: JSON.stringify(result)
        });
      });
  };

  this.myPolls = function (req, res) {
    Polls
      .find({'author': req.user.id}, function (err, result) {
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
        'new-poll', { error: 'Title cannot be empty.' }
      );
    }

    if (options.length < 2) {
      return res.render(
        'new-poll', { error: 'You must provide at least two options separated with comma.' }
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
