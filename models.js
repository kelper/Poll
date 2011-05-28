var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/polldb');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Comment = new Schema({
  author : String,
  body : { type: String, required: true },
  votes : Number,
  created_at : { type: Date, default: Date.now }
});

var Choice = new Schema({
  name : { type: String, required: true },
  votes : { type: Number, default: 0 }
});

var Poll = new Schema({
  title : { type: String, required: true },
  description : { type: String, required: true },
  choices: [Choice],
  comments: [Comment],
  votes : { type: Number, default: 0 },
  created_at : { type: Number, default: Date.now }
});

mongoose.model('Poll', Poll);
var Poll = mongoose.model('Poll');
var testPoll = new Poll();
testPoll.title = "This is a title";
testPoll.description = "Lalalala description here!";

testPoll.save(function(err) {
  if (err) {
    throw err;
  }
  console.log('saved');
  Poll.find({}, function (err, polls) {
    polls.forEach(function(poll) {
      console.log(poll.title);
    });
  });
});

PollModel = function(){};

// Get all Polls
PollModel.prototype.findAll = function (callback) {
  Poll.find({}, function (err, polls) {
    callback(null, polls)
  });
};

// Get Poll by ID
PollModel.prototype.findById = function (id, callback) {
  Poll.findById(id, function (err, poll) {
      if (!err) {
        callback(null, poll);
      }
  });
};

// Update Poll by ID
PollModel.prototype.updateById = function (id, body, callback) {
  Poll.findById(id, function (err, poll) {
    if (!err) {
      poll.description = body.description;
      poll.save(function (err) {
        callback();
      });
    }
  });
};

// Create a new Poll
PollModel.prototype.save = function (params, callback) {
  var poll = new Poll({
    title: params['title'],
    description: params['description'],
    created_at: new Date()
  });
  console.log("The title of the new object is: " + poll.title);
  poll.save(function (err) {
    if (err) console.log("We have an error.");
    callback();
  });
};

// Add comment to Poll
PollModel.prototype.addComment = function (pollID, comment, callback) {
  this.findById(pollID, function(error, poll) {
    if (error) {
      callback(error);
    } else {
      poll.comments.push(comment);
      poll.save(function (err) {
        if (!err) {
          callback();
        }
      });
    }
  });
};

exports.PollModel = PollModel;
