'use strict';

var Users = require('../models/users.js');

function PollsHandler () {

	this.getPolls = function (req, res) { 
		// Users
		// 	.findOne({ 'github.id': req.user.github.id }, { '_id': false })
		// 	.exec(function (err, result) {
		// 		if (err) { throw err; }

		// 		res.render('polls', {polls: result.polls});
		// 	});
		
		Users
			.find({}, function (err, result) {
				if (err) { throw err; }

				res.render('my-polls', {users: result}); 
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

    Users
      .findOneAndUpdate(
        {'github.id': req.user.github.id},
        { 
          'polls.title': title,
          'polls.options': options 
        }
      )
      .exec(function (err, result) {
          if (err) { throw err; }

          res.redirect('my-polls');
        }
      );
  };
}

module.exports = PollsHandler;
