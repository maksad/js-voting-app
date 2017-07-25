'use strict';

const path = process.cwd();
const PollsHandler = require(path + '/app/controllers/pollsHandler.server.js');

module.exports = function (app, passport) {

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  var pollsHandler = new PollsHandler();

  app.route('/login')
    .get(function (req, res) {
      res.render('login');
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/api/:id')
    .get(isLoggedIn, function (req, res) {
      res.json(req.user.github);
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/')
    .get(pollsHandler.getPolls);

  app.route('/profile')
    .get(isLoggedIn, function (req, res) {
      res.render('profile');
    });

  app.route('/new-poll')
    .get(isLoggedIn, function (req, res) {
      res.render('new-poll');
    })
    .post(isLoggedIn, pollsHandler.addPoll);

  app.route('/my-polls')
    .get(isLoggedIn, pollsHandler.myPolls);

  app.route('/:id')
    .get(pollsHandler.singlePoll);

  app.route('/delete/:id')
    .get(isLoggedIn, pollsHandler.deletePoll);

  app.route('/vote/:id')
    .post(isLoggedIn, pollsHandler.votePoll);
};
