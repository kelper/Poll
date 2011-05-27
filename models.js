var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');

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
  votes : Number,
  created_at : Date
});

mongoose.model('Poll', Poll);
var Poll = mongoose.model('Poll');

PollModel = function(){};

// Get all Polls
PollModel.prototype.findAllPolls = function (callback) {
  PollModel.find({}, function (err, polls) {
    callback(null, polls)
  });
};

// Get Poll by ID
PollModel.prototype.findPollByID = function (id, callback) {
  PollModel.findPollByID(id, function (err, poll) {
      if (!err) {
        callback(null, poll);
      }
  });
};

// Update Poll by ID
PollModel.prototype.updatePollByID = function (id, body, callback) {
  PollModel.findPollByID(id, function (err, poll) {
    if (!err) {
      poll.description = body.description;
      poll.save(function (err) {
        callback();
      });
    }
  });
};

// Save a new Poll
PollModel.prototype.createPoll = function (params, callback) {
  var poll = new Poll( {title: params['title'], description: params['description'], created_at: new Date()} );
  poll.save(function (err) {
    callback();
  });
};

// Add comment to Poll
PollModel.prototype.addCommentToPoll = function (pollID, comment, callback) {
  this.findPollByID(pollID, function(error, poll) {
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
