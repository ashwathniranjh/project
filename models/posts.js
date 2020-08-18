const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/users');

const postSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  likes: {
    user: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
          } 
        }
      ]
  },
  user:{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    } 
  }

});

postSchema.methods.addToLikes = function(user) {
    // User.findOne({_id: user._id})
    // .then(curruser => {
    //   curruser.save();
    // })
    // .catch(err => {console.log(err);})
    this.likes.user.push({userId: user._id});
    console.log(this.likes.user);
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);
