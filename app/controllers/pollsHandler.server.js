'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollsHandler() {
  this.votePoll = function(req, res) {
    var optionId = req.body.userChoice;
    var customOption = req.body.customOption;
    var pollId = req.params.id;

    if (customOption) {
      createACustomOptionAndVote(req, res, pollId, customOption);
    } else {
      var asd = 123;
      voteForExistingOption(req, res, pollId, optionId);
    }
  };

  this.singlePoll = function (req, res) {
    Polls
      .findOne({ '_id': req.params.id })
      .exec(function (err, result) {
        if (err) {
          return res.status(404).send('Poll was not found.');
        }

        var isButtonVisible = Boolean(req.user) &&
          result.author.toHexString() === req.user.id;

        res.render('poll', {
          singlePoll: JSON.stringify(result),
          isDeleteButtonVisible: isButtonVisible
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
    var options = parseOptions(req.body.options);

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

function parseOptions(options) {
  var trimmedOptions = options.split(',').map(opt => opt.trim());
  var compressedOptions = compressArray(trimmedOptions);

  var parsedOptions = [];
  for (var option of compressedOptions) {
    if (option.value.trim() !== '') {
      parsedOptions.push(option.value);
    }
  }

  return parsedOptions;
}

function compressArray(original) {
  var compressed = [];
  var copy = original.slice(0);
  for (var i = 0; i < original.length; i++) {
    var myCount = 0;
    for (var w = 0; w < copy.length; w++) {
      if (original[i] == copy[w]) {
        myCount++;
        delete copy[w];
      }
    }
    if (myCount > 0) {
      var a = new Object();
      a.value = original[i];
      a.count = myCount;
      compressed.push(a);
    }
  }
  return compressed;
};

function voteForExistingOption(req, res, pollId, optionId) {
  Polls
    .findByIdAndUpdate(
        { '_id': pollId },
        {$push: {
            'voters': {optionId: optionId, user: req.user.id}
          }
        },
        {safe: true, upsert: true},
        (err, result) => {
          res.redirect('/' + pollId);
        }
    );
}

function createACustomOptionAndVote(req, res, pollId, customOption) {
  Polls
    .findOne({ '_id': pollId })
    .then(addNewOptionToPoll)
    .then(voteForNewlyAddedOption);

  function addNewOptionToPoll(poll) {
    var titles = [];
    for (var option of poll.options) {
      titles.push(option.title);
    }

    if (!titles.includes(customOption)) {
      poll.options.push({title: customOption});
    }

    return poll.save();
  }

  function voteForNewlyAddedOption(updatedPoll) {
    for (var option of updatedPoll.options) {
      if (option.title ===  customOption) {
        return voteForExistingOption(req, res, pollId, option.id);
      }
    }
  }
}

module.exports = PollsHandler;
