const Post = require('../models/posts');
const User = require('../models/users');
const mongodb = require('mongodb');
const multer = require('multer');
const { checkout } = require('../routes/user');




const storage = multer.diskStorage({
  destination: './photos/',
  filename: function(req, file, cb){
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('image');

function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(extname && mimetype){
    return cb(null, true);
  }
  else{
    cb('error: images only!');
  }
}

exports.getIndex = (req,res,next) => {
    console.log(req.user);

    let arr1= [];
    req.user.following.user.forEach((user,index) => {
        User.findById(new mongodb.ObjectId(user.userId))
        .then(user1 => {
          user1.populate('posts.photo.photoId')
          .execPopulate()
          .then(user2 => {
              arr1.push(...user2.posts.photo);
          })
         
        })
        .catch(err => {
          console.log(err);
      });
        
    });
    let arr2=[];
    for(let i=0;i<arr1.length;i++){
        let a = arr1[i];
        for(let j=i+1;j<arr1.length;j++){
            if(a.date > arr1[j].date){
                a = arr1[j];
            }
        }
        arr2.push(a);
    }

    arr2.forEach((obj,index) => {
      obj.populate(obj.user.userId)
      .execPopulate()
      .then(el => {
        arr2[index] = el;
      })
      .catch(err => {
        console.log(err);
    });
    });

    res.render('user/dashboard', {
      path: '/dashboard',
      pageTitle: 'Your Dashboard',
      posts: arr2,
      isAuthenticated: req.session.isLoggedIn
    });
      
  };

  exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(new mongodb.ObjectId(postId))
      .then(post => {
        res.render('user/post-detail', {
          post: post,
          pageTitle: `post`,
          path: `user/post/${postId}`,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
  };

  
exports.getAddPost = (req, res, next) => {
    res.render('user/create', {
      pageTitle: 'Create New Post',
      path: '/create',
      isAuthenticated: req.session.isLoggedIn
      //formsCSS: true,
      //productCSS: true,
      //activeAddEvent: true
    });
  };

  exports.postAddPost = (req, res, next) => {

    upload(req,res, (err) => {
      if(err){
        console.log(err);
      }
      else{
        const date = new Date().toISOString();
        console.log(req.file);
        const description = req.body.description;
        const imageUrl = `http://localhost:3000/${req.file.filename}`;
        const post = new Post({imageUrl:imageUrl,date:date,description:description,user:{userId:req.user._id}});
        post
          .save()
          .then(result => {
            console.log('Created Post');
            req.user.addToPosts(post);
            console.log('saved');
            res.redirect('/profile');
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  //   const image = req.file;
  //   console.log(req.file);
  
   };

  exports.postLike = (req,res,next) => {
    const postId = req.params.postId;
    console.log('2');
    Post.findById(new mongodb.ObjectId(postId))
    .then(post => {
       post.addToLikes(req.user);
       //console.log(post.likes.user);
        res.json({
          message: 'Liked',
          likes: post.likes.user.length
        });
    })
    .catch(err => {
        res.json(
          {
            message: 'Like Failed'
        });
        console.log(err);
    });
  };

  exports.getPersonalProfile = (req,res,next) => {
    req.user
      .populate('posts.photo.photoId')
      .execPopulate()
      .then(user => {
        const posts = user.posts.photo;
        console.log(posts);
        res.render('user/profileSelf', {
          path: '/profile',
          pageTitle: 'Your Profile',
          user:req.user,
          posts: posts,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
  };

  exports.getProfile = (req,res,next) => {
      const userId = req.params.userId;
     
      /*if(req.user.following.user.indexOf({userId: new mongodb.ObjectId(userId)}) === -1){
        isFollow = 0;
      }
      else{
        isFollow = 1;
      }*/

      const isFollow = req.user.following.user.findIndex(cp => {
        return cp.userId.toString() === userId.toString();
      });
      console.log('index is');
      console.log(isFollow);
        User.findById(new mongodb.ObjectId(userId))
        .then(user => {
            user
            .populate('posts.photo.photoId')
            .execPopulate()
            .then(user => {
              const posts = user.posts.photo;
              res.render('user/profile', {
                path: `/user/${user._id}`,
                pageTitle: 'Profile',
                user: user,
                isFollow: isFollow,
                posts: posts,
                isAuthenticated: req.session.isLoggedIn
              });
            })
            .catch(err => console.log(err));
        })
     
  };

  exports.getFollowing = (req,res,next) => {
    const following = req.user.following.user;
    let followinginf = [];
    following.forEach((user,index) => {
        User.findById(new mongodb.ObjectId(user.userId.toString()))
        .then(user => {
            //console.log(user);
            followinginf.push(user);
            console.log(followinginf);
        })
        .catch(err => {
            console.log(err);
        });
    });
    console.log(followinginf);

    res.render('user/following', {
        
        pageTitle: `Following`,
        path: `profile/following`,
        following: followinginf,
        isAuthenticated: req.session.isLoggedIn
      });
  };

  exports.getFollowers = (req,res,next) => {
    const followers = req.user.followers.user;
    const followersinf = [];
    followers.forEach((user,index) => {
        User.findById(new mongodb.ObjectId(user.userId))
        .then(user => {
            followersinf.push(user);
        })
        .catch(err => {
            console.log(err);
        });
    });
    res.render('user/followers', {
        pageTitle: `Followers`,
        followers: followersinf,
        path: `profile/followers`,
        isAuthenticated: req.session.isLoggedIn
      });
  };

  exports.putFollow = (req,res,next) => {
    userId = req.params.userId;
    User.findById(new mongodb.ObjectId(userId))
    .then(user => {
        req.user.addToFollowing(user);
        res.json(
          {message: 'followed',
          followers: user.followers.user.length});

    })
    .catch(err => {
        console.log(err);
    });

  };

  exports.putUnfollow = (req,res,next) => {
    userId = req.params.userId;
    User.findById(new mongodb.ObjectId(userId))
    .then(user => {
        // const followingIndex = req.user.following.user.findIndex(cp => {
        //     return cp.userId.toString() === user._id.toString();
        //   });
        //   const followerIndex = user.followers.user.findIndex(cp => {
        //     return cp.userId.toString() === req.user._id.toString();
        //   });
        // user.followers.user.splice(followerIndex, 1);
        // req.user.following.user.splice(followingIndex, 1);
        console.log(user);
        req.user.unfollow(user);
        console.log('unfollowed');
        res.json(
          {message: 'Unfollowed',
          followers: user.followers.user.length});

    })
    .catch(err => {
        res.json({message: 'Unfollow Failed'});
        console.log(err);
    });
      
};

/*exports.getSearch((req,res,next) => {
    res.render('user/create', {
        pageTitle: 'Create New Post',
        path: '/create',
        isAuthenticated: req.session.isLoggedIn
        //formsCSS: true,
        //productCSS: true,
        //activeAddEvent: true
      });
});

exports.putSearch((req,res,next) => {
    const search = req.search;
    User.findOne({  userid: search })
    .then(user => {
        if (!user) {
            console.log("1");
            return res.redirect('/search');
          }
        else{

        }
    })
})
*/

  

