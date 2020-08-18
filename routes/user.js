const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const isAuth = require('../middleware/is-auth');

const router = express.Router();



router.get('/dashboard', isAuth, userController.getIndex);

router.get('/user/post/:postId', isAuth, userController.getPost);

router.put('/user/post/like/:postId', isAuth, userController.postLike);

//router.get('/notifications', isAuth, userController.getNotifications);

router.get('/create', isAuth, userController.getAddPost);

router.post('/create/add-post', isAuth ,userController.postAddPost);

router.get('/user/:userId', isAuth, userController.getProfile);

router.post('/user/follow/:userId', isAuth, userController.putFollow);

router.delete('/user/unfollow/:userId', isAuth, userController.putUnfollow);

router.get('/profile', isAuth, userController.getPersonalProfile);

router.get('/profile/following', isAuth, userController.getFollowing);

router.get('/profile/followers', isAuth, userController.getFollowers);

//router.get('/events/:eventId', isAuth, userController.getEvent);

module.exports = router;