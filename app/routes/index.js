'use strict';

const path = process.cwd();
const ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
const PollsHandler = require(path + '/app/controllers/pollsHandler.server.js');

module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else { 
      res.redirect('/login');
    }
  }

  var clickHandler = new ClickHandler();
  var pollsHandler = new PollsHandler();

  app.route('/')
    .get(isLoggedIn, function (req, res) {
      res.render('home')
    });

  app.route('/login')
    .get(function (req, res) { 
      res.render('login');
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/profile')
    .get(isLoggedIn, function (req, res) {
      res.render('profile');
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

  app.route('/api/:id/clicks')
    .get(isLoggedIn, clickHandler.getClicks)
    .post(isLoggedIn, clickHandler.addClick)
    .delete(isLoggedIn, clickHandler.resetClicks);
  
  app.route('/new-poll')
    .get(isLoggedIn, function (req, res) {
      res.render('new-poll');
    })
    .post(isLoggedIn, pollsHandler.addPoll);
  
  app.route('/my-polls')
    .get(isLoggedIn, pollsHandler.getPolls);
    
};
