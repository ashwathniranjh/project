const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  email: {
      type: String,
      required: true
  },
  password: {
    type: String,
    required: true
  },
  posts: {
    photo: [
      {
        photoId: 
        {
          type: Schema.Types.ObjectId,
          ref: 'Post',
          required: true
        }
      }
    ]
  },
  followers: {
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
  following: {
    user: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        } 
      }
    ]
  }
});

userSchema.methods.addToPosts = function(post) {
    console.log(this.userid);
    const updatedPhoto = [...this.posts.photo];
      updatedPhoto.push({
        photoId: post._id,
      });
    
   
    this.posts.photo = updatedPhoto;
    console.log
    return this.save();
  };

  /*userSchema.methods.addTolikes = function(user) {
    console.log('1');
    const updatedLikes = [...this.posts.photo.likes];
    const photoIndex = this.posts.photo.findIndex(cp => {
      return cp.userId.toString() === user._id.toString();
    });
    
    
    updatedLikes.push({
      userId: user._id,
      isaccept: 'yes'
    });
    
    this.posts.photo.likes= updatedLikes;

  return this.save(); 
  };*/

  userSchema.methods.addToFollowing = function(user) {
    console.log('1');
    const updatedFollowing = this.following.user;
    
    updatedFollowing.push({
      userId: user._id
    });
    /*const updatedFollowers = [...user.followers.user];
    updatedFollowers.push({
        eventId: this._id
    });
    user.followers.user = updatedFollowers;*/
    user.followers.user.push({userId: this._id});
    user.save();
    
    
  this.following.user = updatedFollowing;
  
  return this.save();
  };

  userSchema.methods.unfollow = function(user){
    const updatedFollowing = this.following.user;
    const followingIndex = this.following.user.findIndex(cp => {
      return cp.userId.toString() === user._id.toString();
    });
    updatedFollowing.splice(followingIndex, 1);
    const followerIndex = user.followers.user.findIndex(cp => {
      return cp.userId.toString() === this._id.toString();
    });
  user.followers.user.splice(followerIndex, 1);
    
  this.following.user = updatedFollowing;
  user.save();
  return this.save();
  
  };
  



  

module.exports = mongoose.model('User', userSchema);

