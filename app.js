/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Include Models

var pollModel = new (require('./models').PollModel);

// Routes

app.get('/', function(req, res){
  pollModel.findAll(function(error, polls) {
    res.render('index', {
      locals: {
        title: 'Index Page',
        polls: polls
      }   
    });
  });
});

app.get('/create', function(req, res) {
  res.render('create', {
    locals: {
      title: 'Create a Poll'
    }
  }); 
});

app.post('/create', function(req, res) {
  pollModel.save({
    title: req.param('title'),
    description: req.param('description')
  }, function(error, docs) {
    res.redirect('/');
  });
});

app.get('/poll/:id', function(req, res) {
  pollModel.findById(req.param('id'), function(error, poll) {
    res.render('show', {
      locals: {
        title: poll.title,
        poll: poll
      }
    });
  });
});

app.get('/poll/:id/edit', function(req, res) {
  pollModel.findById(req.param('id'), function(error, poll) {
    res.render('edit', {
      locals: {
        title: poll.title,
        poll: poll 
      }
    });
  });
});

app.post('/poll/:id/edit', function(req, res) {
  pollModel.updateById(req.param('id'), req.body, function(error, poll) {
    res.redirect('/');
  });
});

app.post('/poll/:id/comments/create', function(req, res) {
  pollModel.addComment(req.param('id'), {
    body: req.body.body,
    created_at: new Date()
  }, function(error, docs) {
    res.redirect('/poll/' + req.param('id'));
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
